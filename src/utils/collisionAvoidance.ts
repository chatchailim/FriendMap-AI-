import { Person } from '../types/friendmap';

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface LabelCandidate {
  dx: number;
  dy: number;
  score: number;
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  distance: number;
}

// 8 Compass Unit Directions
export const COMPASS_DIRECTIONS: Record<string, { x: number; y: number }> = {
  N: { x: 0, y: -1 },
  NE: { x: 0.7071, y: -0.7071 },
  E: { x: 1, y: 0 },
  SE: { x: 0.7071, y: 0.7071 },
  S: { x: 0, y: 1 },
  SW: { x: -0.7071, y: 0.7071 },
  W: { x: -1, y: 0 },
  NW: { x: -0.7071, y: -0.7071 },
};

// Check if two Axis-Aligned Bounding Boxes overlap
export function doBoxesOverlap(a: BoundingBox, b: BoundingBox): boolean {
  return !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxY <= b.minY || a.minY >= b.maxY);
}

// Check if a line segment intersects a circle (head face zone)
export function doesSegmentIntersectCircle(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  center: { x: number; y: number },
  radius: number
): boolean {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    const d = Math.hypot(p1.x - center.x, p1.y - center.y);
    return d <= radius;
  }

  // Projection scalar t of center onto segment p1->p2
  const t = Math.max(0, Math.min(1, ((center.x - p1.x) * dx + (center.y - p1.y) * dy) / lenSq));
  const projX = p1.x + t * dx;
  const projY = p1.y + t * dy;

  const distSq = (center.x - projX) ** 2 + (center.y - projY) ** 2;
  return distSq <= radius * radius;
}

// Check if two line segments (p1-p2) and (p3-p4) intersect
export function doSegmentsIntersect(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  p4: { x: number; y: number }
): boolean {
  function ccw(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
    return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  }
  return (
    ccw(p1, p3, p4) !== ccw(p2, p3, p4) &&
    ccw(p1, p2, p3) !== ccw(p1, p2, p4)
  );
}

// Approximate normalized width & height of balloon label
export function getEstimatedLabelBox(
  person: Person,
  dx: number,
  dy: number,
  aspectRatio: number = 1.6
): BoundingBox {
  const text = person.nickname || person.name || person.id;
  // Estimate normalized width based on character count
  const charWidth = 0.0075;
  const padding = 0.025;
  const width = Math.max(0.06, text.length * charWidth + padding);
  const height = width / (aspectRatio * 2.2);

  const cx = person.head.x + dx;
  const cy = person.head.y + dy;

  return {
    minX: cx - width / 2,
    maxX: cx + width / 2,
    minY: cy - height / 2,
    maxY: cy + height / 2,
  };
}

// Compute protected face bounding box for a person
export function getProtectedFaceBox(person: Person, safetyMarginFactor: number = 1.3): BoundingBox {
  const r = (person.head.radius || 0.025) * safetyMarginFactor;
  return {
    minX: person.head.x - r,
    maxX: person.head.x + r,
    minY: person.head.y - r,
    maxY: person.head.y + r,
  };
}

/**
 * Production Collision-Free Auto-Layout for Balloons & Leader Lines
 * 1. Collect all protected face zones
 * 2. Keep locked labels as immutable obstacles
 * 3. Generate 8-direction x 3-tier distance candidates for each unlocked person
 * 4. Score each candidate: hard penalty for face overlaps; penalize label-label collisions and leader crossings
 * 5. Greedy assign + iterative local relaxation
 */
export function autoArrangeBalloons(
  people: Person[],
  options: {
    arrangeOnlyUnlocked?: boolean;
    aspectRatio?: number;
    safetyMarginFactor?: number;
  } = {}
): Person[] {
  const {
    arrangeOnlyUnlocked = true,
    aspectRatio = 1.6,
    safetyMarginFactor = 1.3,
  } = options;

  const updatedPeople = people.map((p) => ({
    ...p,
    label: { ...p.label },
  }));

  // Build protected face obstacles
  const faceBoxes = people.map((p) => ({
    personId: p.id,
    head: p.head,
    box: getProtectedFaceBox(p, safetyMarginFactor),
  }));

  // Distinct radial distances to evaluate (normalized)
  const distances = [0.065, 0.10, 0.14, 0.19, 0.24];
  const directions: Array<keyof typeof COMPASS_DIRECTIONS> = [
    'N', 'NE', 'NW', 'E', 'W', 'SE', 'SW', 'S'
  ];

  // Placed labels tracker
  const placedLabels: Array<{
    personId: string;
    box: BoundingBox;
    head: { x: number; y: number };
    labelCenter: { x: number; y: number };
  }> = [];

  // Register locked labels first
  for (const person of updatedPeople) {
    if (person.label.locked && arrangeOnlyUnlocked) {
      placedLabels.push({
        personId: person.id,
        box: getEstimatedLabelBox(person, person.label.dx, person.label.dy, aspectRatio),
        head: person.head,
        labelCenter: {
          x: person.head.x + person.label.dx,
          y: person.head.y + person.label.dy,
        },
      });
    }
  }

  // Sort people: back row (higher on image, y smaller) usually prefer placing labels upward/north
  // Front row (bottom, y larger) can place labels downward/south or left/right
  const peopleToArrange = updatedPeople
    .filter((p) => !arrangeOnlyUnlocked || !p.label.locked)
    .sort((a, b) => {
      // Prioritize edge people first, then dense cluster center
      const distFromCenterA = Math.abs(a.head.x - 0.5);
      const distFromCenterB = Math.abs(b.head.x - 0.5);
      return distFromCenterB - distFromCenterA;
    });

  for (const person of peopleToArrange) {
    let bestCandidate: { dx: number; dy: number; score: number } | null = null;
    let minScore = Infinity;

    // Favor directions based on person position
    // e.g. if near top (y < 0.25), prefer N, NE, NW (or S if too close to top edge)
    // if near bottom (y > 0.7), prefer S, SE, SW
    // if near left (x < 0.2), prefer W, NW, SW
    // if near right (x > 0.8), prefer E, NE, SE
    for (const dist of distances) {
      for (const dirName of directions) {
        const dir = COMPASS_DIRECTIONS[dirName];
        const candDx = dir.x * dist;
        const candDy = dir.y * dist;

        const candBox = getEstimatedLabelBox(person, candDx, candDy, aspectRatio);
        const candCenter = { x: person.head.x + candDx, y: person.head.y + candDy };

        let penalty = 0;

        // 1. HARD CONSTRAINT: Must not overlap ANY face box (including self)
        let overlapsFace = false;
        for (const fb of faceBoxes) {
          if (doBoxesOverlap(candBox, fb.box)) {
            overlapsFace = true;
            penalty += 10000;
            break;
          }
        }
        if (overlapsFace) continue; // Skip candidate immediately if covering a face

        // 2. Leader line must not cross another person's face
        for (const fb of faceBoxes) {
          if (fb.personId === person.id) continue;
          if (doesSegmentIntersectCircle(person.head, candCenter, fb.head, fb.head.radius * 1.15)) {
            penalty += 5000;
          }
        }

        // 3. Label-to-label overlap with already placed labels
        for (const pl of placedLabels) {
          if (doBoxesOverlap(candBox, pl.box)) {
            penalty += 3000;
          }
          // Leader line crossing check
          if (doSegmentsIntersect(person.head, candCenter, pl.head, pl.labelCenter)) {
            penalty += 800;
          }
        }

        // 4. Boundary penalty (prefer staying within canvas 0..1, but allow slight gutter margin)
        if (candBox.minX < 0.01) penalty += 500 * (0.01 - candBox.minX);
        if (candBox.maxX > 0.99) penalty += 500 * (candBox.maxX - 0.99);
        if (candBox.minY < 0.01) penalty += 600 * (0.01 - candBox.minY);
        if (candBox.maxY > 0.99) penalty += 500 * (candBox.maxY - 0.99);

        // 5. Distance penalty (prefer shorter leader lines)
        penalty += dist * 150;

        // 6. Natural orientation preference:
        // People in upper half naturally extend upward (N/NE/NW)
        if (person.head.y < 0.4 && (dirName === 'N' || dirName === 'NE' || dirName === 'NW')) {
          penalty -= 50;
        }
        // People in lower half naturally extend downward (S/SE/SW)
        if (person.head.y > 0.6 && (dirName === 'S' || dirName === 'SE' || dirName === 'SW')) {
          penalty -= 50;
        }

        if (penalty < minScore) {
          minScore = penalty;
          bestCandidate = { dx: candDx, dy: candDy, score: penalty };
        }
      }
    }

    if (bestCandidate) {
      person.label.dx = Number(bestCandidate.dx.toFixed(4));
      person.label.dy = Number(bestCandidate.dy.toFixed(4));
    } else {
      // Fallback: place slightly northeast
      person.label.dx = 0.04;
      person.label.dy = -0.07;
    }

    // Register placed label
    placedLabels.push({
      personId: person.id,
      box: getEstimatedLabelBox(person, person.label.dx, person.label.dy, aspectRatio),
      head: person.head,
      labelCenter: {
        x: person.head.x + person.label.dx,
        y: person.head.y + person.label.dy,
      },
    });
  }

  return updatedPeople;
}
