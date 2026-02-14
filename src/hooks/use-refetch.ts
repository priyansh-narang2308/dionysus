import { useQueryClient } from '@tanstack/react-query'

const useRefetch = () => {

    // Fetches all the data and shows it
    const queryClient = useQueryClient()
    return async () => {
        await queryClient.refetchQueries({
            type: "active"
        })
    }


}

export default useRefetch