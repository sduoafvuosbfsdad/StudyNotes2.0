import { Suspense, useMemo } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { NoteLoadingSkeleton } from '@/components/NoteLoadingSkeleton';
import { Layout } from '@/components/layout/Layout';
import { NotePage } from '@/components/notes/NotePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { firstTopic, getNoteHref, getTopicBySlug, getTopicComponent } from '@/notes/registry';

function HomeRedirect() {
  if (!firstTopic) {
    return (
      <Layout>
        <NotFoundPage />
      </Layout>
    );
  }

  return <Navigate to={getNoteHref(firstTopic)} replace />;
}

function RoutedNotePage() {
  const { subject = '', topic = '' } = useParams();

  const note = useMemo(() => getTopicBySlug(subject, topic), [subject, topic]);
  const LazyComponent = useMemo(() => getTopicComponent(subject, topic), [subject, topic]);

  if (!note || !LazyComponent) {
    return <NotFoundPage />;
  }

  return (
    <Suspense fallback={<NoteLoadingSkeleton />}>
      <NotePage note={note}>
        <LazyComponent />
      </NotePage>
    </Suspense>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route
        path="/:subject/:topic"
        element={
          <Layout>
            <RoutedNotePage />
          </Layout>
        }
      />
      <Route
        path="*"
        element={
          <Layout>
            <NotFoundPage />
          </Layout>
        }
      />
    </Routes>
  );
}
