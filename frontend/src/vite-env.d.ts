/// <reference types="vite/client" />

declare module '@stellar/freighter-api' {
  export interface FreighterApi {
    isConnected(): Promise<boolean>;
    getAddress(): Promise<string>;
    signTransaction(xdr: string, options?: any): Promise<string>;
    signAuthEntry(authEntry: string): Promise<string>;
    signMessage(message: string): Promise<string>;
  }

  export const getFreighterApi: () => Promise<FreighterApi>;
}
