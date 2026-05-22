declare module 'svg-maps__common' {
  export interface Map {
    label?: string;
    viewBox: string;
    locations: Array<{
      id: string;
      name?: string;
      path: string;
    }>;
  }
}
