/* eslint-disable */

import BN from 'bn.js';

import BigNumber from 'bignumber.js';
import {
	PromiEvent,
	TransactionReceipt,
	EventResponse,
	EventData,
	Web3ContractContext,
} from 'ethereum-abi-types-generator';

export interface CallOptions {
  from?: string;
  gasPrice?: string;
  gas?: number;
}

export interface SendOptions {
  from: string;
  value?: number | string | BN | BigNumber;
  gasPrice?: string;
  gas?: number;
}

export interface EstimateGasOptions {
  from?: string;
  value?: number | string | BN | BigNumber;
  gas?: number;
}

export interface MethodPayableReturnContext {
  send(options: SendOptions): PromiEvent<TransactionReceipt>;
  send(
    options: SendOptions,
    callback: (error: Error, result: any) => void
  ): PromiEvent<TransactionReceipt>;
  estimateGas(options: EstimateGasOptions): Promise<number>;
  estimateGas(
    options: EstimateGasOptions,
    callback: (error: Error, result: any) => void
  ): Promise<number>;
  encodeABI(): string;
}

export interface MethodConstantReturnContext<TCallReturn> {
  call(): Promise<TCallReturn>;
  call(options: CallOptions): Promise<TCallReturn>;
  call(
    options: CallOptions,
    callback: (error: Error, result: TCallReturn) => void
  ): Promise<TCallReturn>;
  encodeABI(): string;
}

export type MethodReturnContext = MethodPayableReturnContext

export type ContractContext = Web3ContractContext<
  Registryadapter,
  RegistryadapterMethodNames,
  RegistryadapterEventsContext,
  RegistryadapterEvents
>;
export type RegistryadapterEvents = undefined;
export interface RegistryadapterEventsContext {}
export type RegistryadapterMethodNames =
  | 'new'
  | 'adapterInfo'
  | 'adapterPositionOf'
  | 'addressesGeneratorAddress'
  | 'assetAllowances'
  | 'assetBalance'
  | 'assetDynamic'
  | 'assetPositionsOf'
  | 'assetStatic'
  | 'assetUnderlyingTokenAddress'
  | 'assetUserMetadata'
  | 'assetsAddresses'
  | 'assetsDynamic'
  | 'assetsDynamic'
  | 'assetsLength'
  | 'assetsPositionsOf'
  | 'assetsPositionsOf'
  | 'assetsStatic'
  | 'assetsStatic'
  | 'assetsTokensAddresses'
  | 'assetsUserMetadata'
  | 'extensionsAddresses'
  | 'helperAddress'
  | 'oracleAddress'
  | 'owner'
  | 'registryAddress'
  | 'setExtensionsAddresses'
  | 'supportedPositions'
  | 'tokenAllowances'
  | 'updateSlot';
export interface AdapterinfoResponse {
  id: string;
  typeId: string;
  categoryId: string;
}
export interface AdapterpositionResponse {
  balanceUsdc: string;
}
export interface AllowanceResponse {
  owner: string;
  spender: string;
  amount: string;
}
export interface UnderlyingTokenBalanceResponse {
  amount: string;
  amountUsdc: string;
}
export interface MetadataResponse {
  pricePerShare: string;
  migrationAvailable: boolean;
  latestVaultAddress: string;
  depositLimit: string;
  emergencyShutdown: boolean;
}
export interface AssetdynamicResponse {
  id: string;
  typeId: string;
  tokenId: string;
  underlyingTokenBalance: UnderlyingTokenBalanceResponse;
  metadata: MetadataResponse;
}
export interface TokenAllowancesResponse {
  owner: string;
  spender: string;
  amount: string;
}
export interface AssetAllowancesResponse {
  owner: string;
  spender: string;
  amount: string;
}
export interface PositionResponse {
  assetId: string;
  tokenId: string;
  typeId: string;
  balance: string;
  underlyingTokenBalance: UnderlyingTokenBalanceResponse;
  tokenAllowances: TokenAllowancesResponse[];
  assetAllowances: AssetAllowancesResponse[];
}
export interface AssetstaticResponse {
  id: string;
  typeId: string;
  tokenId: string;
  name: string;
  version: string;
  symbol: string;
  decimals: string;
}
export interface AssetusermetadataResponse {
  depositBalance: string;
}
export interface Registryadapter {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _oracleAddress Type: address, Indexed: false
   * @param _helperAddress Type: address, Indexed: false
   * @param _addressesGeneratorAddress Type: address, Indexed: false
   */
  'new'(
    _oracleAddress: string,
    _helperAddress: string,
    _addressesGeneratorAddress: string
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  adapterInfo(): MethodConstantReturnContext<AdapterinfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accountAddress Type: address, Indexed: false
   */
  adapterPositionOf(
    accountAddress: string
  ): MethodConstantReturnContext<AdapterpositionResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  addressesGeneratorAddress(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accountAddress Type: address, Indexed: false
   * @param assetAddress Type: address, Indexed: false
   */
  assetAllowances(
    accountAddress: string,
    assetAddress: string
  ): MethodConstantReturnContext<AllowanceResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param assetAddress Type: address, Indexed: false
   */
  assetBalance(assetAddress: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param assetAddress Type: address, Indexed: false
   */
  assetDynamic(
    assetAddress: string
  ): MethodConstantReturnContext<AssetdynamicResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accountAddress Type: address, Indexed: false
   * @param assetAddress Type: address, Indexed: false
   */
  assetPositionsOf(
    accountAddress: string,
    assetAddress: string
  ): MethodConstantReturnContext<PositionResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param assetAddress Type: address, Indexed: false
   */
  assetStatic(
    assetAddress: string
  ): MethodConstantReturnContext<AssetstaticResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param assetAddress Type: address, Indexed: false
   */
  assetUnderlyingTokenAddress(
    assetAddress: string
  ): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param assetAddress Type: address, Indexed: false
   * @param accountAddress Type: address, Indexed: false
   */
  assetUserMetadata(
    assetAddress: string,
    accountAddress: string
  ): MethodConstantReturnContext<AssetusermetadataResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  assetsAddresses(): MethodConstantReturnContext<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  assetsDynamic(): MethodConstantReturnContext<AssetdynamicResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _assetsAddresses Type: address[], Indexed: false
   */
  assetsDynamic(
    _assetsAddresses: string[]
  ): MethodConstantReturnContext<AssetdynamicResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  assetsLength(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accountAddress Type: address, Indexed: false
   * @param _assetsAddresses Type: address[], Indexed: false
   */
  assetsPositionsOf(
    accountAddress: string,
    _assetsAddresses: string[]
  ): MethodConstantReturnContext<PositionResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accountAddress Type: address, Indexed: false
   */
  assetsPositionsOf(
    accountAddress: string
  ): MethodConstantReturnContext<PositionResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  assetsStatic(): MethodConstantReturnContext<AssetstaticResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _assetsAddresses Type: address[], Indexed: false
   */
  assetsStatic(
    _assetsAddresses: string[]
  ): MethodConstantReturnContext<AssetstaticResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  assetsTokensAddresses(): MethodConstantReturnContext<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accountAddress Type: address, Indexed: false
   */
  assetsUserMetadata(
    accountAddress: string
  ): MethodConstantReturnContext<AssetusermetadataResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  extensionsAddresses(): MethodConstantReturnContext<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  helperAddress(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  oracleAddress(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  registryAddress(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newExtensionsAddresses Type: address[], Indexed: false
   */
  setExtensionsAddresses(
    _newExtensionsAddresses: string[]
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  supportedPositions(parameter0: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accountAddress Type: address, Indexed: false
   * @param assetAddress Type: address, Indexed: false
   */
  tokenAllowances(
    accountAddress: string,
    assetAddress: string
  ): MethodConstantReturnContext<AllowanceResponse[]>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param slot Type: bytes32, Indexed: false
   * @param value Type: bytes32, Indexed: false
   */
  updateSlot(
    slot: string | number[],
    value: string | number[]
  ): MethodReturnContext;
}
