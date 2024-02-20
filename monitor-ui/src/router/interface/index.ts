export interface MetaProps {
  icon?: any;
  keepAlive?: boolean;
  requiresAuth?: boolean;
  title: string;
  key?: string;
  notShow?:boolean;
}

export interface RouteObject {
  caseSensitive?: boolean;
  children?: RouteObject[];
  element?: React.ReactNode;
  // index?: boolean; // React-dom省升级之后不支持
  path?: string;
  meta?: MetaProps;
  isLink?: string;
}
