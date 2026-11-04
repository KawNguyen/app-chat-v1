import { QueryKey, useQueryClient } from "@tanstack/react-query"

export function useRefresh(keys: QueryKey[]) {
  const qc = useQueryClient()
  return () =>
    Promise.all(keys.map((queryKey) => qc.invalidateQueries({ queryKey })))
}
