export interface RegionPathItem {
  code: string;
  name: string;
}

export interface RegionOption {
  code: string;
  name: string;
  leaf: boolean;
}

export interface RegionDetail {
  code: string;
  name: string;
  leaf: boolean;
  path: RegionPathItem[];
  /** 从省到当前级，空格分隔，与用户表 region 一致 */
  fullPath: string;
}

export interface RegionSelection {
  cityCode: string;
  label: string;
}

export interface ProfileCity {
  name: string;
  /** 从省到当前级的完整地名 */
  fullPath: string;
}
