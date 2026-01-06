export const HooksExplanation = () => {
    return (
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                🎓 World-Class React Patterns
            </h3>

            <div className="space-y-6">

                {/* useSyncExternalStore */}
                <div className="p-5 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                    <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">📦</span>
                        <div>
                            <div className="font-bold text-blue-900 text-lg mb-1">
                                1. useSyncExternalStore
                            </div>
                            <div className="text-blue-800 text-sm mb-2">
                                Standard pattern for connecting React to external data sources
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 rounded-lg p-4 space-y-2 text-sm">
                        <div><strong>Purpose:</strong> Sync React with data outside React's control</div>
                        <div><strong>Used for:</strong> localStorage, browser APIs, WebSockets, global state</div>
                        <div><strong>Why it matters:</strong> Ensures React stays in sync with external changes</div>
                        <div className="pt-2 border-t border-blue-200">
                            <strong>In this app:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700">
                                <li>Persists todos to localStorage</li>
                                <li>Monitors browser online/offline status</li>
                                <li>Auto-updates when external data changes</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* useOptimistic */}
                <div className="p-5 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                    <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">⚡</span>
                        <div>
                            <div className="font-bold text-orange-900 text-lg mb-1">
                                2. useOptimistic
                            </div>
                            <div className="text-orange-800 text-sm mb-2">
                                Industry standard for instant UI updates with automatic rollback
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 rounded-lg p-4 space-y-2 text-sm">
                        <div><strong>Purpose:</strong> Show changes immediately before server confirms</div>
                        <div><strong>Pattern:</strong> Update → Show instantly → API call → Replace or rollback</div>
                        <div><strong>Why it matters:</strong> App feels instant (like Google Docs, Notion, Figma)</div>
                        <div className="pt-2 border-t border-orange-200">
                            <strong>In this app:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700">
                                <li>New todos appear instantly with orange badge</li>
                                <li>If API fails, todo automatically disappears</li>
                                <li>No loading spinners blocking user flow</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* useTransition */}
                <div className="p-5 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                    <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">🔄</span>
                        <div>
                            <div className="font-bold text-purple-900 text-lg mb-1">
                                3. useTransition
                            </div>
                            <div className="text-purple-800 text-sm mb-2">
                                Professional pattern for non-blocking UI updates
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 rounded-lg p-4 space-y-2 text-sm">
                        <div><strong>Purpose:</strong> Keep UI responsive during slow operations</div>
                        <div><strong>Pattern:</strong> Mark updates as non-urgent → React keeps UI smooth</div>
                        <div><strong>Why it matters:</strong> Users can keep working while app processes</div>
                        <div className="pt-2 border-t border-purple-200">
                            <strong>In this app:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700">
                                <li>Toggle checkbox → Blue badge appears instantly</li>
                                <li>API call runs in background (0.8s)</li>
                                <li>You can still scroll, click, type during this time!</li>
                                <li>No frozen UI or "loading hell"</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};