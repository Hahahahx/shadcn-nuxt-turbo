export enum MinioServiceEvent {
  Create = 'minio-create',
  CreateByToken = 'minio-create-by-token',
  Exit = 'minio-exit',
  BucketExists = 'bucket-exists',
  BucketsList = 'buckets-list',
  BucketCreate = 'bucket-create',
  BucketRemove = 'bucket-remove',
  ObjectsList = 'objects-list',
  ObjectsRemove = 'objects-remove',
  ObjectsUpload = 'objects-upload',
  ObjectsDownload = 'objects-download',
}
