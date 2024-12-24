import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

export default async function Study(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    <div className="">
        <h1 className="text-5xl text-neutral-600">About:{params.slug} </h1>
        <p className="text-md text-neutral-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas quis dui ac tellus bibendum posuere. Curabitur convallis justo vel vestibulum consequat. Suspendisse ac tortor eu dolor placerat dapibus. Donec porta, lacus eu accumsan porttitor, magna ex viverra diam, non sollicitudin ligula eros placerat ipsum. Nunc maximus turpis nec arcu placerat pharetra. Nullam id varius nisl. Proin commodo nisi non ligula auctor, nec volutpat dolor suscipit. In mattis dui dui. Nunc consectetur ex sed nibh mollis, quis mattis odio vestibulum</p>
        <div>
            
        </div>
    </div>
}