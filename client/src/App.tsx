import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpLink } from '@trpc/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAtom } from 'jotai';
import pages from './pages/router';
import { trpc } from './api/_trpc';
import { userAtom } from './hooks/User';

const router = createBrowserRouter([...pages]);

function App() {
  const [user] = useAtom(userAtom);
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: 'http://localhost:8080/api/trpc',
          // optional
          headers() {
            return {
              authorization: `Bearer ${user.id}`,
            };
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
