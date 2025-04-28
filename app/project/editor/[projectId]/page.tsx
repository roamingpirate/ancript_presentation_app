import getProject from "@/app/actions/getProject";
import ProjectEditor from "@/components/ProjectEditor/ProjectEditor";
import { Suspense } from "react";

const Project = async ({ projectId }: { projectId: string }) => {
    const projectDetails = await getProject(projectId);

    if (!projectDetails) return <p>No project found</p>;

    const fileId = projectDetails.fileId;

    return (
        <ProjectEditor projectDetails={projectDetails}/>
    );
};

const Page = ({ params }: { params: { projectId: string } }) => {
    return (
        <Suspense fallback={<p>Loading project details...</p>}>
            <Project projectId={params.projectId} />
        </Suspense>
    );
};

export default Page;
