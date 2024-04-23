import "@mantine/core/styles.css";




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
              <div className="relative flex flex-col h-screen">
        
                <main className="container mx-auto max-w-full pt-16 px-6 flex-grow">
                  {children}
                </main>
              </div>
            </Shell>
    
        </AuthProvider>
      </body>
    </html>
  );
}
