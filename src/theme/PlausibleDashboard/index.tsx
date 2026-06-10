import React from 'react';
import Layout from '@theme/Layout';
import type { EmbedData } from '../../types.js';

interface Props {
  embedData: EmbedData;
}

export default function PlausibleDashboard({ embedData }: Props): React.ReactElement {
  const { authToken, domain, customDomain, title, description } = embedData;
  const src = `https://${customDomain}/share/${domain}?auth=${authToken}&embed=true&theme=system&background=transparent`;

  return (
    <Layout title={title}>
      <main style={{ padding: '2rem' }}>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        <iframe
          src={src}
          loading="lazy"
          style={{ width: '100%', height: 'calc(100dvh - var(--ifm-navbar-height) - 7rem)', minHeight: '600px', border: 'none' }}
          title={title}
        />
      </main>
    </Layout>
  );
}
