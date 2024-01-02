import { ObjectRules } from "src/types/ruleObject.type";
import { ParamDef, ServiceApiConfig, ServiceConfigChild, ServiceConfigRoot } from "src/types/userService.type";

export default class DocViewObj {
  #rootTitle!: string;
  #rootTitleText!: string;
  #rootDescription?: string;
  #childObjDataList?: ChildObjData[] = [];

  constructor(serviceConfig: ServiceConfigRoot) {
    this.#rootTitle = `$${serviceConfig.name}`;
    this.rootTitleText = serviceConfig.name;
    this.rootDescription = serviceConfig.description;

    serviceConfig.children?.forEach((item) => {
      const childItem = new ChildObjData(item, this.#rootTitle);
      this.#childObjDataList?.push(childItem);
    });
  }

  set rootTitleText(text: string) {
    this.#rootTitleText = `${text} API documentation`;
  }

  set rootDescription(text: string | undefined) {
    this.#rootDescription = `${text}`;
  }
}

export class ChildObjData {
  #rootTitle?: string;
  #childTitleText?: string;
  #childDescription?: string;

  #childObjDataList?: ChildObjData[];
  #apiObjDataList?: ApiObjData[];

  constructor(serviceConfig: ServiceConfigChild, rootTitle?: string) {
    this.#rootTitle = rootTitle;
    this.childTitleText = serviceConfig.name || serviceConfig.route;
    this.childDescription = serviceConfig.description;

    // 處理ＡＰＩ
    this.#apiObjDataList = [];

    if (Array.isArray(serviceConfig.api)) {
      // 有ＡＰＩ：[]
      serviceConfig.api.forEach((item) => {
        const apiItem = new ApiObjData(item, this.childTitleText);
        this.#apiObjDataList?.push(apiItem);
      });
    } else if (!serviceConfig.api) {
      // 有ＡＰＩ：{}
      const apiItem = new ApiObjData(serviceConfig.api, this.childTitleText);
      this.#apiObjDataList?.push(apiItem);
    }

    // 處理子路由
    if (serviceConfig.children) {
      this.#childObjDataList = [];
      serviceConfig.children.forEach((item) => {
        const childItem = new ChildObjData(item, this.#childTitleText);
        this.#childObjDataList?.push(childItem);

        // 子路由無配置ＡＰＩ
        if (!item.api) {
          const apiItem = new ApiObjData(
            { name: item.name || item.route, description: item.description },
            this.childTitleText,
          );
          this.#apiObjDataList?.push(apiItem);
        } else if (!Array.isArray(item.api)) {
          // 子路由有配置ＡＰＩ，但為{}
          const apiConfigName = { name: item.api?.name || item.name || item.route };
          const newApiConfig = { ...item.api, ...apiConfigName };
          const apiItem = new ApiObjData(newApiConfig, this.childTitleText);

          this.#apiObjDataList?.push(apiItem);
        }
      });
    }
  }

  set childTitleText(text: string) {
    this.#childTitleText = `${this.#rootTitle}.${text}`;
  }
  get childTitleText(): string {
    return this.#childTitleText || "undefined??";
  }

  set childDescription(text: string | undefined) {
    this.#childDescription = text;
  }
}

export class ApiObjData {
  #childTitle!: string;
  #apiTitleText!: string;
  #apiDescription!: string;
  #payloadDataList?: PayloadData[];

  constructor(apiConfig: ServiceApiConfig | undefined, childTitle: string) {
    this.#payloadDataList = this.#getPayLoadDataList(apiConfig);
    this.#childTitle = childTitle;
    this.apiTitleText = apiConfig?.name || "undefined??";
    this.apiDescription = apiConfig?.description || "undefined";
  }

  set apiTitleText(text: string) {
    this.#apiTitleText = `${this.#childTitle}.${text}(${
      this.#payloadDataList && this.#payloadDataList?.length > 0 ? "payload" : ""
    })`;
  }

  set apiDescription(text: string) {
    this.#apiDescription = text;
  }

  #getPayLoadDataList(apiConfig?: ServiceApiConfig): PayloadData[] {
    const payloadList: PayloadData[] = [];

    this.#handleParam(payloadList, apiConfig?.param);
    this.#handleParam(payloadList, apiConfig?.query);
    this.#handleParam(payloadList, apiConfig?.body);

    // 處理validator
    if (apiConfig?.rules) {
      Object.entries(apiConfig?.rules).forEach((item) => {
        payloadList.some((item2) => {
          if (item2.name === item[0] || item2.name === item[0].slice(1)) {
            item2.setRule(item);

            return true;
          }
        });
      });
    }

    return payloadList;
  }

  #handleParam(payloadList: PayloadData[], param?: ParamDef | undefined): void {
    if (param) {
      if (Array.isArray(param)) {
        param.forEach((item) => {
          // const payloadItem = new PayloadData(item.);
        });
      } else {
        Object.entries(param).forEach((item) => {
          const payloadItem = new PayloadData();
          payloadItem.setFromParam(item);
          payloadList.push(payloadItem);
        });
      }
    }
  }
}

export class PayloadData {
  #name!: string;
  get name() {
    return this.#name;
  }
  #optional: boolean = false;
  #type: string = "--";
  #min: number | string = "--";
  #max: number | string = "--";
  #equal: number | string = "--";
  #customizeValidator: boolean = false;
  #ruleSet: string = "--";
  #description!: string;

  // constructor(data: Record<string, string>) {
  //   this.#name = data.;
  // }

  setFromParam(item: [string, string]): void {
    this.#name = item[0];
    this.#description = item[1];
  }

  setRule(item: [string, ObjectRules]) {
    // 判斷optional
    if (item[0][0] === "$") {
      this.#optional = true;
    }

    // 判斷customize validator
    if (typeof item[1] !== "string") {
      this.#customizeValidator = true;
    } else {
      // 判斷type
      const tempValidatorList = item[1].split("@");
      this.#type = tempValidatorList[0];

      if (tempValidatorList[1]) {
        const tempLimitList = tempValidatorList[1].split(":");

        this.#min = tempLimitList[0] ? tempLimitList[0] : "--";
        this.#max = tempLimitList[1] ? tempLimitList[1] : "--";
      }
    }
  }
}
