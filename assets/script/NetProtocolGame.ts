/*
 * @Author: dgflash
 * @Date: 2022-04-21 13:45:51
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-21 13:51:33
 */
import { IProtocolHelper, IRequestProtocol, IResponseProtocol, NetData } from "../../extensions/oops-plugin-framework/assets/libs/network/NetInterface";


/** Pako.js 数据压缩协议 */
export class NetProtocolGame implements IProtocolHelper {//主打一个啥也没干
    getHeadlen(): number {
        return 0;
    }

    getHearbeat(): NetData {
        let str = JSON.stringify({"cmdCode": 0});
        return str;
    }

    getPackageLen(msg: NetData): number {
        return msg.toString().length;
    }

    checkResponsePackage(respProtocol: IResponseProtocol): boolean {
        return true;
    }

    handlerResponsePackage(respProtocol: IResponseProtocol): boolean {
        /*
        if (respProtocol.code == 1) {
            if (respProtocol.isCompress) {
                respProtocol.data = unzip(respProtocol.data);
            }
            respProtocol.data = JSON.parse(respProtocol.data);

            return true;
        }
        else {
            return false;
        }
        */
        return true;
    }

    handlerRequestPackage(reqProtocol: IRequestProtocol): string {
        var rspCmd = reqProtocol.cmd;
        reqProtocol.callback = rspCmd;
        /*
        if (reqProtocol.isCompress) {
            reqProtocol.data = zip(reqProtocol.data);
        }
        */
        return rspCmd;
    }

    getPackageId(respProtocol: IResponseProtocol): string {
        return respProtocol.callback!;
        //console.log("getPackageId:",respProtocol.data)
        //return respProtocol.data.netCode;
    }
}