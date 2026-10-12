export interface HeadPoint {
  x: number; // Normalized coordinate [0..1]
  y: number; // Normalized coordinate [0..1]
  radius: number; // Normalized radius [0..1]
}

export interface LabelPlacement {
  dx: number; // Normalized offset from head.x
  dy: number; // Normalized offset from head.y
  locked: boolean;
  visible: boolean;
  theme?: 'cartoon' | 'badge' | 'minimal' | 'dark' | 'yellow';
  customColor?: string;
  customDirection?: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
}

export interface ContactInfo {
  phone: string;
  email: string;
  lineId: string;
  social?: string;
}

export interface Person {
  id: string; // e.g. "P001"
  name: string;
  nickname: string;
  groupTag?: string; // e.g. "แถวนั่งหน้า", "แถวกลาง", "แถวยืนหลัง"
  contact: ContactInfo;
  notes: string;
  head: HeadPoint;
  label: LabelPlacement;
  reviewed: boolean;
  depthRow?: 'front_seated' | 'middle_standing' | 'back_standing';
  visualHint?: string;
  avatarColor?: string;
  photoUrl?: string; // Attached personal portrait photo / avatar
  voiceMemoUrl?: string; // Attached audio recording / greeting memo (dataUrl)
  voiceMemoDuration?: number; // Duration in seconds
}

export type BalloonTheme = 'cartoon' | 'badge' | 'minimal' | 'dark' | 'yellow';
export type LeaderLineStyle = 'solid' | 'dashed' | 'curved' | 'cartoon';

export interface BalloonSettings {
  balloonTheme: BalloonTheme;
  balloonColor: string;
  leaderLineColor: string;
  leaderLineWidth: number;
  leaderLineStyle: LeaderLineStyle;
  badgeShape?: 'rounded' | 'comic' | 'pill' | 'square';
  fontSize: number;
  showNicknamesOnly: boolean;
  showIds: boolean;
  showDots: boolean;
  showFacesBBox: boolean;
  privacyMode: boolean; // Hide contact details in viewer and export
  autoAvoidFaces: boolean;
}

export interface PhotoInfo {
  id: string;
  title: string;
  url: string;
  fileName?: string;
  width: number;
  height: number;
  aspectRatio: number;
  sourceType: 'sample' | 'uploaded' | 'url' | 'empty';
  fileSizeBytes?: number;
  mimeType?: string;
  capturedDate?: string;
  locationName?: string;
  cameraInfo?: string;
  depthLayers?: number;
  notes?: string;
}

export interface PhotoMetadataJSON {
  version: string;
  exportType: 'friendmap_photo_metadata';
  exportedAt: string;
  photoMetadata: {
    id: string;
    fileName: string;
    title: string;
    width: number;
    height: number;
    aspectRatio: number;
    fileSizeBytes?: number;
    mimeType?: string;
    capturedDate?: string;
    locationName?: string;
    cameraInfo?: string;
    depthLayers?: number;
    notes?: string;
  };
  statistics: {
    totalPeople: number;
    reviewedCount: number;
    unreviewedCount: number;
    rowsCount: number;
  };
  settings: BalloonSettings;
  people: Person[];
}

export interface FriendMapProject {
  version: string;
  title: string;
  updatedAt: string;
  photo: PhotoInfo;
  people: Person[];
  settings: BalloonSettings;
}
