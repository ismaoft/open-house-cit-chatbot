import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('open-house-chatbot');

  private readonly citLogoUrl =
    'https://complejoeducativocit.ed.cr/wp-content/uploads/2025/08/favcit.png';

  ngAfterViewInit(): void {
    this.loadBotpress();
  }

  openChat(): void {
    document.getElementById('bp-webchat')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.botpress?.open();
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private loadBotpress(): void {
    if (document.querySelector('script[data-botpress="inject"]')) {
      return;
    }

    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v3.6/inject.js';
    injectScript.dataset['botpress'] = 'inject';

    injectScript.onload = () => {
      window.botpress?.on?.('webchat:initialized', () => {
        window.botpress?.config?.({
          configuration: {
            botName: 'Asistente CIT',
            botAvatar: this.citLogoUrl,
            botDescription: 'Guía del Open House',
            composerPlaceholder: 'Escribí tu pregunta...',
            color: '#009f9a',
            variant: 'soft',
            headerVariant: 'solid',
            themeMode: 'light',
            radius: 1,
            footer: '',
            showPoweredBy: false,
            additionalStylesheet: `
              .bpHeaderContainer {
                display: none !important;
              }

              .bpMessageListContainer {
                border-top: 0 !important;
              }
            `
          }
        });

        window.botpress?.open();
      });

      const configScript = document.createElement('script');
      configScript.src =
        'https://files.bpcontent.cloud/2026/06/02/13/20260602130239-JNRRUH2T.js';
      configScript.dataset['botpress'] = 'config';
      document.body.appendChild(configScript);
    };

    document.body.appendChild(injectScript);
  }
}

declare global {
  interface Window {
    botpress?: {
      config?: (options: { configuration: Record<string, unknown> }) => void;
      on?: (eventName: string, callback: () => void) => void;
      open: () => void;
    };
  }
}
