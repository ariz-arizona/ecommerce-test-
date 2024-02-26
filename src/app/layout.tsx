import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from "antd";

import "./globals.scss";

export const metadata: Metadata = {
  title: "TestTaskValantis",
  description: "aarizona for TestTaskValantis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <div className="container">
          <AntdRegistry>
            <ConfigProvider theme={{ token: { colorPrimary: '#800080' } }}>
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </div>
      </body>
    </html>
  );
}
