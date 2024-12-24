import { Navbarimpli } from "@/components/Nav-Final";
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return(
        <html lang="en">
            <body>
                <Navbarimpli/>
                {children}
            </body>
        </html>
    )
}