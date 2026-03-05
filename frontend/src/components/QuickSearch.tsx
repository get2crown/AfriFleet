import React, { useState, KeyboardEvent, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const pages = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Vehicles', path: '/vehicles' },
  { name: 'Maintenance', path: '/maintenance' },
  { name: 'Fuel Logs', path: '/fuel' },
  { name: 'Reports', path: '/reports' },
  { name: 'Approvals', path: '/approvals' },
];

const QuickSearch: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  const filtered = pages.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (open) setFilter('');
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} onKeyDown={handleKeyDown} fullWidth>
      <DialogTitle>Quick search</DialogTitle>
      <TextField
        autoFocus
        placeholder="Type to search..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mx: 2, my: 1 }}
      />
      <List>
        {filtered.map((page) => (
          <ListItem key={page.path} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(page.path);
                onClose();
              }}
            >
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default QuickSearch;
