/*
 * @Author: yuxuanli
 * @Date: 2023-05-23 15:57:36
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-19 17:32:07
 * @FilePath: \monitor-ui\pontTemplate.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Interface, BaseClass, Property, CodeGenerator, Surrounding } from "pont-engine";

export default class MyGenerator extends CodeGenerator {
  getInterfaceContentInDeclaration(inter: Interface) {
    let requestParams = inter.getRequestParams();
    const paramsCode = inter.getParamsCode("Params");
    if (requestParams.includes("params:")) {
      requestParams = requestParams.replace("params:", "params?:");
    }
    if (requestParams.includes("body:")) {
      requestParams = requestParams.replace("body:", "body?:");
    }
    return `
      export ${paramsCode}

      export type Response = ${inter.responseType}
      export const path = "${inter.path}"

      export const init: Response;

      export function request(${requestParams}): Promise<Response>;
    `;
  }

  // getBaseClassInDeclaration(base: BaseClass) {
  //   const originProps = base.properties;

  //   base.properties = base.properties.map((prop) => {
  //     return new Property({
  //       ...prop,
  //       required: false,
  //     });
  //   });

  //   const result = super.getBaseClassInDeclaration(base);
  //   base.properties = originProps;

  //   return result;
  // }

  getInterfaceContent(inter: Interface) {
    const method = inter.method.toUpperCase();
    let paramsCode = inter.getParamsCode("Params", this.surrounding);
    const isParams = ["GET", "DELETE"].includes(method);
    let path = inter.path;
    path = path.replace("/{id}", "/${params.id}");
    // 主题集id
    path = path.replace("/{subjectId}", "/${params.subjectId}");
    // 字典编码
    path = path.replace("/{dictCode}", "/${params.dictCode}");
    path = path.replace("/{resultId}", "/${params.resultId}");
    if (path.includes("/api/v3")) {
      path = path.replace("/api/v3", "");
    }
    paramsCode = paramsCode.replace("class", "interface");
    return `
    /**
     * @desc ${inter.description}
     */

    import * as defs from '../../baseClass';
    import { request as  requestMethod} from "@/axios";
    export ${paramsCode}
    export const init = ${inter.response.getInitialValue()};
    export const path = "${inter.path}";
    const getParams = function(params,options?){
      return ${isParams} ? {
        url: \`${path}\`,
        method: "${method}",
        params:params || {},
        ...options
      } :{
        url: \`${path}\`,
        method: "${method}",
        data:params || {},
        ...options
      }
    }
    export const request = (params?: Params,options?:any)=> {
      return requestMethod(
        getParams(params,options)
      )
    }
   `;
  }
}
