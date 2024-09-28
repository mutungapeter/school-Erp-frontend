'use client';

import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import MarksList from "@/src/components/Marks/marksList"
const MarksListPage =()=>{
    return (
        <DefaultLayout>
            <MarksList />
        </DefaultLayout>
    )
}
export default MarksListPage