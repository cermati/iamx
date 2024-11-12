# Identity Access Management eXecutor (IAMX)
## Introduction
IAMX is a JavaScript-based framework for building an identity access management engine that is plaform and use-case agnostic.  
This framework can be embedded in any kind of tool or web application.  
You can refer to the following diagram to get the high level component view of IAMX.

```
              ┌────────────┐            ┌────────────┐
              │            │            │            │
              │ Platform A │            │ Platform B │
              │            │            │            │
              └──────▲─────┘            └──────▲─────┘
                     │                         │
     ┌───────────────┼──────┐  ┌───────────────┼──────┐
     │ IAMX Connector│A     │  │ IAMX Connector│B     │
     │               │      │  │               │      │
     │  ┌────────────┴────┐ │  │ ┌─────────────┴───┐  │
     │  │ Platform A      │ │  │ │ Platform B      │  │
     │  │ Connector       │ │  │ │ Connector       │  │
     │  │ Implementation  │ │  │ │ Implementation  │  │
     │  └───────────────▲─┘ │  │ └─▲───────────────┘  │
     │                  │   │  │   │                  │
     └──────────────────┼───┘  └───┼──────────────────┘
                        │          │
┌───────────────────────┼──────────┼────┐
│ IAMX Core             │          │    │
│                       │          │    │
│  ┌───────────────┐   ┌┴──────────┴┐   │
│  │               │   │            │   │
│  │  Credentials  │   │ Connector  │   │
│  │  Registry     │   │ Interface  │   │
│  │               │   │            │   │
│  └──────┬────────┘   └─────▲──────┘   │
│         │                  │          │
│  ┌──────▼──────────────────┴───────┐  │
│  │                                 │  │
│  │             Executor            │  │
│  │                                 │  │
│  └────────────────▲────────────────┘  │
│                   │                   │
└───────────────────┼───────────────────┘
                    │
   ┌────────────────┴────────────────┐
   │                                 │
   │        Application Logic        │
   │                                 │
   └─────────────────────────────────┘
```
The core component is broken down further into 3 components:
1. `Credentials Registry`: A key-value store that keeps the credentials and configuration information for the platforms' IAMX connector that we are supporting in the form of YAML. The core also defines how the credentials will be loaded and it will use the credentials to create/delete new users in the platform.

2. `Executor`: The backbone of the IAMX framework, as it’s the module that manages the creation of the connector object and execution of the logic implemented inside the connector object. The execution itself will be driven by the application logic where it’s being used and it’s also responsible to return the execution result to the application logic.

3. `Connector Interface`: It defines the API contract to be implemented in each target platform connector so that the executor can carry out uniform steps of operations regardless of the target platforms. You can also consider this as the abstraction layer to interact with the target platforms.

The component that you need to implement is the IAMX connector which act as some
kind of "plugin" to manage the target platform access.

## Glossary
Before jumping in to the implementation, there are several terms that you need to know:
1. `*WorkflowContext`  
Context in `*WorkflowContext` means key value pair (you can think of it like the required request body or query) that are required to execute the respective operation.

2. `MutatingWorkflowContext`  
Context required to execute the mutating workflow, e.g. provision and revoke access.

3. `ReadonlyWorkflowContext`  
Context required to execute the read only workflow, e.g. show the details of an access record.

4. `ListWorkflowContext`  
Context required to execute the list workflow (used in `fetchBatch` method). The list operation purpose is to get the actual access in the target platform.

5. `ListAvailableAccessContextWorkflowContext`  
Context required to execute the list available access context of a target platform dynamically.

6. `ListCustomFieldsOptionsWorkflowContext`  
Context required to execute the list of custom fields options of a target platform dynamically.

7. `AccessContext`  
The key-value pair (or sometimes just the value) that represents a group/role/other similar terms name that is recognized by the target platform.

## Implementation
The connector needs to implement this contract class (written in TypeScript to ease explaining the definition):
### Connector interface
```typescript
/**
 * The interface to implement the IAMX connector
 * You can pass the credentials registry config on the constructor
 */
interface Connector<
  MutatingWorkflowContextT,
  ReadonlyWorkflowContextT,
  ShowResultT,
  ListWorkflowContextT,
  ListAvailableAccessContextWorkflowContextT,
  ListCustomFieldsOptionsWorkflowContextT,
  AvailableContextResultT,
  CustomFieldsOptionsResultT
> {
  /**
   * @function engine
   * @description return the connector engine id
   */
  engine(): string

  /**
   * @function version
   * @description return the connector engine version
   */
  version(): string

  /**
   * @function name
   * @description return the connector engine name
   */
  name(): string

  /**
   * @function supportedExecution
   * @description return the list of opertaions that are supported by the connector
   */
  supportedExecution(): string[]

  /**
   * @function registryFormat
   * @description return the JSON schema definition to validate the credentials
   * registry value
   */
  registryFormat(): Record<string, unknown>

  /**
   * @function readContextFormat
   * @description return the JSON schema definition to be used when validating
   * the passed ReadonlyWorkflowContext value
   */
  readContextFormat(): Record<string, unknown>

  /**
   * @function writeContextFormat
   * @description return the JSON schema definition to be used when validating
   * the passed MutatingWorkflowContext value
   */
  writeContextFormat(): Record<string, unknown>

  /**
   * @function listContextFormat
   * @description return the JSON schema definition to be used when validating
   * the passed ListWorkflowContext value
   */
  listContextFormat(): Record<string, unknown>

  /**
   * @function listAvailableAccessContextFormat
   * @description (optional to be implemented) return the JSON schema definition to be
   * used when validating the passed ListAvailableAccessContextWorkflowContext value.
   * The method implementation can be skipped if it doesn't need to list available
   * access context dynamically from the target platform
   */
  listAvailableAccessContextFormat()?: Record<string, unknown>

  /**
   * @function listCustomFieldsOptionsContextFormat
   * @description (optional to be implemented) return the JSON schema definition to be
   * used when validating the passed ListCustomFieldsOptionsWorkflowContext value.
   * The method implementation can be skipped if it doesn't need to list custom
   * fields options of the target platform.
   */
  listCustomFieldsOptionsContextFormat()?: Record<string, unknown>

  /**
   * @function provision
   * @description provision the access on the target platform based on the passed
   * context
   */
  provision(context: MutatingWorkflowContextT): Promise<MutatingWorkflowContextT>

  /**
   * @function revoke
   * @description revoke the access on the target platform based on the passed
   * context
   */
  revoke(context: MutatingWorkflowContextT): Promise<MutatingWorkflowContextT>

  /**
   * @function show
   * @description view the access details on the target platform based on the passed
   * context
   */
  show(context: ReadonlyWorkflowContextT): Promise<ShowResultT>

  /**
   * @function fetchBatch
   * @description list all the user info details in batch (if possible).
   * Returns BatchIterator whose interface will be defined in the next section.
   */
  fetchBatch(context: ListWorkflowContextT): Promise<BatchIterator>

  /**
   * @function listAvailableAccessContext
   * @description (optional to be implemented) list available access context
   * of a target platform based on the passed context
   */
  listAvailableAccessContext(context: ListAvailableAccessContextWorkflowContextT)?: Promise<AvailableContextResultT>

  /**
   * @function listCustomFieldsOptions
   * @description (optional to be implemented) list custom fields options
   * of a target platform based on the passed context
   */
  listCustomFieldsOptions(context: ListCustomFieldsOptionsWorkflowContextT)?: Promise<CustomFieldsOptionsResultT>
}
```

### BatchIterator interface
```typescript
/**
 * The interface to implement the BatchIterator class for the fetchBatch method.
 * You need to pass the connector instance, and page details along with the
 * list result to the constructor (can be combined into a single object)
 */
interface BatchIterator<ListResultT> {
  /**
   * results - Holds the array of user info details
   */
  results: Array<any>

  /**
   * @function hasNext
   * @description checks whether the result still have more results or not
   * If the platform does not support batch/pagination when listing the access,
   * you can simply return false here
   */
  hasNext(): boolean

  /**
   * @function next
   * @description return the BatchIterator for next page
   * If the platform does not support batch/pagination when listing the access,
   * you can simply return null here
   */
  next(): Promise<BatchIterator<ListResultT>>
}
```

## Examples
You can view the examples in this repository [examples](https://github.com/cermati/iamx/tree/35d1505c982f1ea1cf0e888009ef0f966c696bdc/examples) directory and several
actual connectors that we use:
1. [AWS Connector](https://github.com/cermati/iamx-aws-connector)
2. [Aliyun Connector](https://github.com/cermati/iamx-aliyun-connector)
3. [Redash Connector](https://github.com/cermati/iamx-redash-connector)
