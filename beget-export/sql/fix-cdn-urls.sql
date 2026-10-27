UPDATE media_library
SET url = CONCAT('/uploads/', SUBSTRING_INDEX(url, '/files/', -1))
WHERE url LIKE 'https://cdn.poehali.dev/projects/%/files/%';

UPDATE news
SET images = CAST(REPLACE(CAST(images AS CHAR),
  'https://cdn.poehali.dev/projects/7488612f-bc39-44e9-b251-23f2645125bb/files/', '/uploads/') AS JSON);

UPDATE content_blocks
SET data = CAST(REPLACE(CAST(data AS CHAR),
  'https://cdn.poehali.dev/projects/7488612f-bc39-44e9-b251-23f2645125bb/files/', '/uploads/') AS JSON);
