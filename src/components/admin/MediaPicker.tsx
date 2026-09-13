import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { uploadApi, type MediaItem } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const DOC_ICON: Record<string, string> = {
  'application/pdf': 'FileText',
  'application/msword': 'FileType2',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'FileType2',
  'application/vnd.ms-excel': 'FileSpreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'FileSpreadsheet',
};

const DOC_LABEL: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
};

const isImage = (contentType: string | null) => !!contentType && IMAGE_TYPES.includes(contentType);

type MediaPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: MediaItem) => void;
  /** Ограничить выбор только изображениями (например, для фото новости) */
  imagesOnly?: boolean;
};

const MediaPicker = ({ open, onOpenChange, onSelect, imagesOnly }: MediaPickerProps) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    uploadApi
      .list()
      .then(setItems)
      .catch(() => toast({ title: 'Не удалось загрузить библиотеку', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = items.filter((i) => {
    if (imagesOnly && !isImage(i.contentType)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (i.filename || '').toLowerCase().includes(q) || (i.label || '').toLowerCase().includes(q);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-[20px] uppercase tracking-tight">
            Выбрать из библиотеки
          </DialogTitle>
        </DialogHeader>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени файла…"
          className="h-11 rounded-none border-border bg-background"
        />

        {loading ? (
          <p className="text-muted-foreground">Загрузка…</p>
        ) : (
          <div className="grid grid-cols-3 gap-px bg-border sm:grid-cols-4">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item);
                  onOpenChange(false);
                }}
                className="group flex flex-col bg-card text-left transition-colors hover:bg-background"
              >
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-background">
                  {isImage(item.contentType) ? (
                    <img
                      src={item.url}
                      alt={item.filename || ''}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                      <Icon name={DOC_ICON[item.contentType || ''] || 'File'} fallback="File" size={28} />
                      <span className="font-display text-[10px] uppercase tracking-[0.08em]">
                        {DOC_LABEL[item.contentType || ''] || 'Файл'}
                      </span>
                    </div>
                  )}
                </div>
                <p className="truncate p-2 text-[11px] text-muted-foreground" title={item.filename || ''}>
                  {item.filename || 'без имени'}
                </p>
              </button>
            ))}
            {!filtered.length && (
              <div className="col-span-full bg-card p-8 text-center text-muted-foreground">
                {items.length ? 'Ничего не найдено' : 'Библиотека пуста — загрузите файлы в разделе «Медиабиблиотека»'}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaPicker;
