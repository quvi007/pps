import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddVideo from './Video/AddVideo';
import Subjects from './Subject/Subjects';
import Subject from './Subject/Subject';
import Chapter from './Chapter/Chapter';
import PhysicsProblemSolvingPage from './Home';

function App() {
  return (
    <Router basename="/pps">
        <Routes>
            <Route path="/" element={<PhysicsProblemSolvingPage />} />
            {/* <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:subjectId" element={<Subject />} />
            <Route path="/subjects/:subjectId/chapters/:chapterId" element={<Chapter />} />
            <Route path="/subjects/:subjectId/chapters/:chapterId/videos/new" element={<AddVideo />} />
            <Route path="/subjects/:subjectId/chapters/:chapterId/videos/:videoId/edit" element={<><h1>Edit Video</h1></>} />
            <Route path="/subjects/:subjectId/chapters/:chapterId/videos/:videoId" element={<><h1>View Video</h1></>} />
            <Route path="/subjects/:subjectId/chapters/:chapterId/worksheets/new" element={<><h1>Add Worksheet</h1></>} />
            <Route path="/subjects/:subjectId/chapters/:chapterId/worksheets/:worksheetId/edit" element={<><h1>Edit Worksheet</h1></>} />
            <Route path="/subjects/:subjectId/chapters/:chapterId/videos/:videoId/notes/new" element={<><h1>Add Note</h1></>} />
            <Route path="/subjects/:subjectId/chapters/:chapterId/videos/:videoId/notes/:noteId/edit" element={<><h1>Edit Note</h1></>} /> */}
        </Routes>
    </Router>
  );
}

export default App;