/// <reference types="@docusaurus/module-type-aliases" />

declare module '@docusaurus/ExecutionEnvironment' {
  const ExecutionEnvironment: {
    readonly canUseDOM: boolean;
  };
  export default ExecutionEnvironment;
}
