export type VideoAsset = {
  id: string;
  title: string;
  file: File;
  order: number;
};

export type VideoFolder = {
  id: string;
  title: string;
  theme?: string;
  videos: VideoAsset[];
};

export type FolderUploadProgress = {
  folderId: string;
  folderTitle: string;
  current: string;
  currentIndex: number;
  total: number;
  progress: number;
  status: "uploading" | "completed";
};

export function sortVideosByOrder(videos: VideoAsset[]) {
  return [...videos].sort((a, b) => a.order - b.order);
}

export function buildFolderSequence(folders: VideoFolder[]) {
  return folders.map((folder) => ({
    ...folder,
    videos: sortVideosByOrder(folder.videos),
  }));
}

export async function uploadFolderProgressively(
  folder: VideoFolder,
  uploadVideo: (video: VideoAsset, index: number, total: number) => Promise<void>,
  onProgress?: (payload: FolderUploadProgress) => void,
) {
  const orderedVideos = sortVideosByOrder(folder.videos);

  if (orderedVideos.length === 0) {
    const completedPayload: FolderUploadProgress = {
      folderId: folder.id,
      folderTitle: folder.title,
      current: "No hay videos para subir",
      currentIndex: 0,
      total: 0,
      progress: 100,
      status: "completed",
    };

    onProgress?.(completedPayload);
    return {
      folderId: folder.id,
      uploaded: 0,
      status: "completed" as const,
    };
  }

  for (let index = 0; index < orderedVideos.length; index += 1) {
    const video = orderedVideos[index];
    const progress = Math.round(((index + 1) / orderedVideos.length) * 100);

    onProgress?.({
      folderId: folder.id,
      folderTitle: folder.title,
      current: video.title,
      currentIndex: index + 1,
      total: orderedVideos.length,
      progress,
      status: "uploading",
    });

    await uploadVideo(video, index + 1, orderedVideos.length);
  }

  const finalPayload: FolderUploadProgress = {
    folderId: folder.id,
    folderTitle: folder.title,
    current: "Completado",
    currentIndex: orderedVideos.length,
    total: orderedVideos.length,
    progress: 100,
    status: "completed",
  };

  onProgress?.(finalPayload);

  return {
    folderId: folder.id,
    uploaded: orderedVideos.length,
    status: "completed" as const,
  };
}
