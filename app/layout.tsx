import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import "@mantine/charts/styles.css";

import Shell from "@/components/Shell";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "Capture The Flag",
  description: "",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Shell>
      
                {children}
          
          </Shell>
        </AuthProvider>
      </body>
    </html>
  );
}
