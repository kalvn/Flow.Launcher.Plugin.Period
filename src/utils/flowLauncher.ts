import type { JsonRpcRequest, JsonRpcResponse } from '../types.js';

export const FlowLauncher = {
  /**
   * Shows a desktop notification.
   * @param title The notification title.
   * @param subtitle The notification text content.
   */
  showMessage: function (title: string, subtitle: string) {
    sendJsonRpcRequest({
      method: 'Flow.Launcher.ShowMsg',
      parameters: [
        title,
        subtitle,
        ''
      ]
    });
  }
};

export function sendJsonRpcRequest (req: JsonRpcRequest): void {
  console.log(JSON.stringify(req));
}

export function sendJsonRpcResponse (res: JsonRpcResponse): void {
  console.log(JSON.stringify(res));
}
