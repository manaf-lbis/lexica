import React from 'react'
import { Link } from 'react-router-dom'

export const Footer:React.FC = () => {
    return (
        <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-12 sm:mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                            ✎
                        </div>
                        <span className="text-xl font-bold text-white">Lexica</span>
                    </div>
                    <p className="text-slate-400 max-w-md">
                        A platform for writers and readers. Share your stories, discover inspiring content, and build your audience.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link to="https://x.ai/api" className="hover:text-white transition-colors">
                                    API
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    Guides
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-white transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-700 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400">
                    <p>© 2025 Lexica. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 sm:mt-0">
                        <Link to="#" className="hover:text-white transition-colors">
                            Twitter
                        </Link>
                        <Link to="#" className="hover:text-white transition-colors">
                            GitHub
                        </Link>
                        <Link to="#" className="hover:text-white transition-colors">
                            LinkedIn
                        </Link>
                        <Link to="#" className="hover:text-white transition-colors">
                            Discord
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer