import React from "react"

import NewArticleForm from "../components/editor/NewArticleForm"

export const Write: React.FC = () => {

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <NewArticleForm />
            </main>
        </div>
    )
}
