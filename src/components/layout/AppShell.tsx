import { Box, Container } from '@mui/material';
import { useState, createContext, useContext, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface SearchContextValue {
  search: string;
}

const SearchContext = createContext<SearchContextValue>({ search: '' });

export function useGlobalSearch() {
  return useContext(SearchContext);
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchContext = useMemo(() => ({ search }), [search]);

  return (
    <SearchContext.Provider value={searchContext}>
      <Box sx={{ display: 'flex', height: '100vh', maxHeight: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
          <TopBar
            onMenuClick={() => setMobileOpen(true)}
            search={search}
            onSearchChange={setSearch}
          />
          <Container
            maxWidth="xl"
            sx={{
              py: 3,
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Outlet />
            </Box>
          </Container>
        </Box>
      </Box>
    </SearchContext.Provider>
  );
}
