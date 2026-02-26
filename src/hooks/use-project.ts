import { api } from "@/trpc/react"
import { useEffect } from "react"
import { useLocalStorage } from "usehooks-ts"


const useProject = () => {

    const { data: projects } = api.project.getProjects.useQuery()
    const [projectId, setProjectId] = useLocalStorage("dionysus-projectId", "")

    const project = projects?.find(project => project.id === projectId)

    useEffect(() => {
        if (!projectId && projects?.[0]) {
            setProjectId(projects[0].id)
        }
    }, [projects, projectId, setProjectId])

    return {
        projects,
        projectId,
        setProjectId,
        project
    }
}

export default useProject