import React from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Gallery from './Gallery';
import './App.css';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Gallery />
            <ReactQueryDevtools initialIsOpen/>
        </QueryClientProvider>
    );
}

export default App;