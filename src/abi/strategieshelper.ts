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
  Strategieshelper,
  StrategieshelperMethodNames,
  StrategieshelperEventsContext,
  StrategieshelperEvents
>;
export type StrategieshelperEvents = undefined;
export interface StrategieshelperEventsContext {}
export type StrategieshelperMethodNames =
  | 'new'
  | 'assetStrategies'
  | 'assetStrategiesAddresses'
  | 'assetStrategiesDelegatedBalance'
  | 'assetStrategiesLength'
  | 'assetStrategy'
  | 'assetsStrategies'
  | 'assetsStrategies'
  | 'assetsStrategiesAddresses'
  | 'assetsStrategiesDelegatedBalance'
  | 'assetsStrategiesLength'
  | 'helperAddress'
  | 'registryAdapterAddress';
export interface StrategymetadataResponse {
  name: string;
  apiVersion: string;
  strategist: string;
  rewards: string;
  vault: string;
  keeper: string;
  want: string;
  emergencyExit: boolean;
  isActive: boolean;
  delegatedAssets: string;
  estimatedTotalAssets: string;
}
export interface Strategieshelper {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _registryAdapterAddress Type: address, Indexed: false
   * @param _helperAddress Type: address, Indexed: false
   */
  'new'(
    _registryAdapterAddress: string,
    _helperAddress: string
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param assetAddress Type: address, Indexed: false
   */
  assetStrategies(
    assetAddress: string
  ): MethodConstantReturnContext<StrategymetadataResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param assetAddress Type: address, Indexed: false
   */
  assetStrategiesAddresses(
    assetAddress: string
  ): MethodConstantReturnContext<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param assetAddress Type: address, Indexed: false
   */
  assetStrategiesDelegatedBalance(
    assetAddress: string
  ): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param assetAddress Type: address, Indexed: false
   */
  assetStrategiesLength(
    assetAddress: string
  ): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param strategyAddress Type: address, Indexed: false
   */
  assetStrategy(
    strategyAddress: string
  ): MethodConstantReturnContext<StrategymetadataResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _assetsStrategiesAddresses Type: address[], Indexed: false
   */
  assetsStrategies(
    _assetsStrategiesAddresses: string[]
  ): MethodConstantReturnContext<StrategymetadataResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  assetsStrategies(): MethodConstantReturnContext<StrategymetadataResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  assetsStrategiesAddresses(): MethodConstantReturnContext<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  assetsStrategiesDelegatedBalance(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  assetsStrategiesLength(): MethodConstantReturnContext<string>;
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
  registryAdapterAddress(): MethodConstantReturnContext<string>;
}
