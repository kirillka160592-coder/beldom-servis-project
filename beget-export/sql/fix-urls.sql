UPDATE media_library
SET url = CONCAT('/uploads/', SUBSTRING_INDEX(url, '/uploads/', -1))
WHERE url LIKE '%/uploads/%' AND url NOT LIKE '/uploads/%';

UPDATE news
SET images = CAST(REPLACE(REPLACE(CAST(images AS CHAR),
  'https://kommyn4o.bget.ru/uploads/', '/uploads/'),
  'http://kommyn4o.bget.ru/uploads/', '/uploads/') AS JSON);

UPDATE content_blocks
SET data = CAST(REPLACE(REPLACE(CAST(data AS CHAR),
  'https://kommyn4o.bget.ru/uploads/', '/uploads/'),
  'http://kommyn4o.bget.ru/uploads/', '/uploads/') AS JSON);
