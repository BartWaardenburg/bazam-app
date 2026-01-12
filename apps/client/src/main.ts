import './web-components/quiz-timer/quiz-timer.element';
import './web-components/quiz-progress-bar/quiz-progress-bar.element';
import './web-components/quiz-avatar/quiz-avatar.element';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
