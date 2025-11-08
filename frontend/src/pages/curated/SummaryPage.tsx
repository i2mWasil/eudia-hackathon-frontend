import { useState, useEffect, type ReactNode } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface CompanyData {
  companyName: string;
  domain: string;
  logoUrl: string;
  lastUpdated: string;
  eulaContent: string;
}

// Fetch EULA data from the API
const fetchCompanyEULA = async (domain: string): Promise<CompanyData> => {
  try {
    const response = await fetch(
      `https://bs7x3fr9-8000.inc1.devtunnels.ms/context/eula/archive?domain=${encodeURIComponent(domain)}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch EULA: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // The API returns a string with the EULA content
    // Transform the response to match our CompanyData interface
    return {
      companyName: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
      domain: domain,
      logoUrl: `https://logo.clearbit.com/${domain}`,
      lastUpdated: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      eulaContent: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    };
  } catch (error) {
    console.error('Error fetching EULA:', error);
    throw error;
  }
};

export function SummaryPage() {
  const [searchParams] = useSearchParams();
  const domain = searchParams.get('domain');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (domain) {
      setIsLoading(true);
      setError(null);
      fetchCompanyEULA(domain)
        .then(data => {
          setCompanyData(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch EULA:', error);
          setError(error.message || 'Failed to load company data');
          setIsLoading(false);
        });
    } else {
      setError('No domain specified');
      setIsLoading(false);
    }
  }, [domain]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Loading EULA data...</p>
          <p className="text-muted-foreground/60 text-sm mt-2">{domain}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-destructive text-lg mb-4">Failed to load company data</p>
          <p className="text-muted-foreground text-sm mb-6">{error}</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-destructive text-lg mb-4">No data available</p>
          <p className="text-muted-foreground text-sm mb-6">Unable to find EULA data for {domain}</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <header className={`${isDark ? 'border-white/20' : 'border-black/20'} border rounded-3xl mx-4 mt-4 md:mx-8 md:mt-8`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className={`rounded-full ${isDark ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10'}`}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <ImageWithFallback
                src={companyData.logoUrl}
                alt={`${companyData.companyName} Logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <h1 className={isDark ? 'text-white' : 'text-black'}>{companyData.companyName}</h1>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`rounded-full ${isDark ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10'}`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className={`${isDark ? 'bg-black border-white/20' : 'bg-white border-black/20'} border rounded-3xl`}>
          <div className="px-6 py-8 md:px-12 md:py-10">
            <h2 className={`mb-2 ${isDark ? 'text-white' : 'text-black'}`}>End User License Agreement</h2>
            <p className={`mb-8 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Last Updated: {companyData.lastUpdated}
            </p>
            <Separator className={isDark ? 'bg-white/20' : 'bg-black/20'} />
          </div>
          
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="px-6 md:px-12 pb-10">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }: { children?: ReactNode }) => (
                      <h1 className={`mb-6 ${isDark ? 'text-white' : 'text-black'}`}>{children}</h1>
                    ),
                    h2: ({ children }: { children?: ReactNode }) => (
                      <>
                        <h2 className={`mt-12 mb-4 ${isDark ? 'text-white' : 'text-black'}`}>{children}</h2>
                        <Separator className={`mb-6 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                      </>
                    ),
                    h3: ({ children }: { children?: ReactNode }) => (
                      <h3 className={`mt-8 mb-3 ${isDark ? 'text-white' : 'text-black'}`}>{children}</h3>
                    ),
                    p: ({ children }: { children?: ReactNode }) => (
                      <p className={`mb-4 leading-relaxed ${isDark ? 'text-white/80' : 'text-black/80'}`}>{children}</p>
                    ),
                    ul: ({ children }: { children?: ReactNode }) => (
                      <ul className={`list-disc list-inside mb-4 space-y-2 ${isDark ? 'text-white/80' : 'text-black/80'}`}>{children}</ul>
                    ),
                    li: ({ children }: { children?: ReactNode }) => (
                      <li className={isDark ? 'text-white/80' : 'text-black/80'}>{children}</li>
                    ),
                    strong: ({ children }: { children?: ReactNode }) => (
                      <strong className={isDark ? 'text-white' : 'text-black'}>{children}</strong>
                    ),
                    hr: () => <Separator className={`my-8 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />,
                  }}
                >
                  {companyData.eulaContent}
                </ReactMarkdown>
              </div>
            </div>
          </ScrollArea>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className={isDark ? 'text-white/60' : 'text-black/60'}>
            © 2025 {companyData.companyName}. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
