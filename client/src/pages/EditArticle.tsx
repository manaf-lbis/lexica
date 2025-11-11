import EditArticleForm from '../components/editor/EditArticleForm'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetArticleForEditQuery } from '../api/articleApi';
import LoadingScreen from '../components/LoadingScreen';

const EditArticle = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { data, isLoading, error } = useGetArticleForEditQuery(params.id);
    if (error) navigate("/")


    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <EditArticleForm article={data} />
            </main>
        </div>
    )
}

export default EditArticle