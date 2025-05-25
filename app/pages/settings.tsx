import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAppState } from '../utils/hooks';
import { hapticFeedback } from '../utils/telegram';
import { TaskStatus } from '../types';

interface DefaultTaskSettings {
  warningHours: number;
  criticalHours: number;
  defaultStatus: TaskStatus;
  defaultIconName: string;
  defaultIconLibrary: string;
}

export default function Settings() {
  const { state, setState, isLoading } = useAppState();
  const [settings, setSettings] = React.useState<DefaultTaskSettings>(() => ({
    warningHours: 24,
    criticalHours: 48,
    defaultStatus: 'active',
    defaultIconName: 'FaCar',
    defaultIconLibrary: 'fa',
  }));

  const handleSave = () => {
    hapticFeedback.medium();
    if (!state) return;

    setState({
      ...state,
    });
  };

  const handleReset = () => {
    hapticFeedback.heavy();
    setSettings({
      warningHours: 24,
      criticalHours: 48,
      defaultStatus: 'active',
      defaultIconName: 'FaCar',
      defaultIconLibrary: 'fa',
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: '16px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: 600,
            }}
          >
            Settings
          </h1>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <Button
              variant="secondary"
              onClick={handleReset}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              Default Task Settings
            </h2>
          </CardHeader>
          <CardContent>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <Input
                  label="Warning Hours"
                  type="number"
                  value={settings.warningHours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      warningHours: Math.max(1, parseInt(e.target.value) || 0),
                    })
                  }
                  min={1}
                />
                <Input
                  label="Critical Hours"
                  type="number"
                  value={settings.criticalHours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      criticalHours: Math.max(1, parseInt(e.target.value) || 0),
                    })
                  }
                  min={1}
                />
              </div>

              <div>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#666666',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  Default Status
                </span>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <Button
                    variant={settings.defaultStatus === 'active' ? 'primary' : 'secondary'}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        defaultStatus: 'active',
                      })
                    }
                  >
                    Active
                  </Button>
                  <Button
                    variant={settings.defaultStatus === 'warning' ? 'warning' : 'secondary'}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        defaultStatus: 'warning',
                      })
                    }
                  >
                    Warning
                  </Button>
                  <Button
                    variant={settings.defaultStatus === 'critical' ? 'error' : 'secondary'}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        defaultStatus: 'critical',
                      })
                    }
                  >
                    Critical
                  </Button>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <Input
                  label="Default Icon Name"
                  value={settings.defaultIconName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultIconName: e.target.value,
                    })
                  }
                />
                <Input
                  label="Default Icon Library"
                  value={settings.defaultIconLibrary}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultIconLibrary: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 