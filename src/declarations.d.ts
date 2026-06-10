/// <reference types="@docusaurus/module-type-aliases" />

declare module '@docusaurus/ExecutionEnvironment' {
  const ExecutionEnvironment: {
    readonly canUseDOM: boolean;
  };
  export default ExecutionEnvironment;
}

// @docusaurus/module-type-aliases omits title/description; @docusaurus/theme-classic adds them.
declare module '@theme/Layout' {
  interface Props {
    readonly title?: string;
    readonly description?: string;
  }
}
