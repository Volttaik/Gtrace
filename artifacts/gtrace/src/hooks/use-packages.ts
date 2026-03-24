import { useQueryClient } from "@tanstack/react-query";
import { 
  useListPackages, 
  useTrackPackage, 
  useCreatePackage, 
  useUpdatePackage, 
  useDeletePackage,
  useUpdatePackageLocation,
  useScheduleMove,
  useSearchLocations,
  getListPackagesQueryKey,
  getTrackPackageQueryKey,
  getSearchLocationsQueryKey
} from "@workspace/api-client-react";
import type { 
  CreatePackageRequest, 
  UpdatePackageRequest, 
  UpdateLocationRequest, 
  ScheduleMoveRequest,
  SearchLocationsParams
} from "@workspace/api-client-react";

// Re-export querying hooks with defaults
export function usePackages() {
  return useListPackages();
}

export function useTracking(trackingId: string) {
  return useTrackPackage(trackingId, {
    query: {
      queryKey: getTrackPackageQueryKey(trackingId),
      enabled: !!trackingId && trackingId.trim().length > 0,
      retry: false,
      refetchInterval: (query) => {
        const data = query.state.data;
        return data?.scheduledMove ? 20000 : false;
      },
      refetchIntervalInBackground: false,
    }
  });
}

export function useLocationSearch(q: string) {
  return useSearchLocations({ q }, {
    query: {
      queryKey: getSearchLocationsQueryKey({ q }),
      enabled: q.length >= 1,
      staleTime: 60000,
    }
  });
}

// Wrapped mutations with cache invalidation
export function useCreatePackageMutation() {
  const queryClient = useQueryClient();
  return useCreatePackage({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
      }
    }
  });
}

export function useUpdatePackageMutation() {
  const queryClient = useQueryClient();
  return useUpdatePackage({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
        // Can't easily know trackingId here without parsing returned data, but list refresh covers admin view
      }
    }
  });
}

export function useDeletePackageMutation() {
  const queryClient = useQueryClient();
  return useDeletePackage({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
      }
    }
  });
}

export function useUpdateLocationMutation() {
  const queryClient = useQueryClient();
  return useUpdatePackageLocation({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
        if (data.trackingId) {
          queryClient.invalidateQueries({ queryKey: getTrackPackageQueryKey(data.trackingId) });
        }
      }
    }
  });
}

export function useScheduleMoveMutation() {
  const queryClient = useQueryClient();
  return useScheduleMove({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
        if (data.trackingId) {
          queryClient.invalidateQueries({ queryKey: getTrackPackageQueryKey(data.trackingId) });
        }
      }
    }
  });
}
