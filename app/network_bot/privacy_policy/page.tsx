export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ильдар Нэтворк Bot Privacy Policy</h1>
          <div className="h-1 w-24 bg-gray-900 mx-auto"></div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-gray-900">
            <section>
              <p className="text-lg leading-relaxed">
                Это приватно, шо пиздец!
              </p>
            </section>
            
            <section>
              <p className="text-lg leading-relaxed">
                Обещаю не сливать твои данные)
              </p>
            </section>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
} 