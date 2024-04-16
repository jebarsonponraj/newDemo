import "../styles/globals.css";

let title = "Dream Room Generator";
let description = "Generate your dream room in seconds.";




export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#17181C] text-white">
        {children}
      </body>
    </html>
  );
}
