declare module '@docusaurus/ExecutionEnvironment' {
  const ExecutionEnvironment: {
    readonly canUseDOM: boolean;
  };
  export default ExecutionEnvironment;
}
