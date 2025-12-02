export interface ImageParams {
  subject: string;
  style: string;
  lighting: string;
  colors: string;
  details: string;
  aspectRatio: AspectRatio;
}

export enum AspectRatio {
  SQUARE = "1:1",
  LANDSCAPE = "16:9",
  PORTRAIT = "9:16",
  CLASSIC_LANDSCAPE = "4:3",
  CLASSIC_PORTRAIT = "3:4"
}

export interface GeneratedResult {
  imageUrl: string;
  promptUsed: string;
}

export interface GenerationError {
  message: string;
}
