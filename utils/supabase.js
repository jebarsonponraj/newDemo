import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://ljbqfukbmhjepcplbkyo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqYnFmdWtibWhqZXBjcGxia3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1Nzg2NjEsImV4cCI6MjAyNjE1NDY2MX0.GXd6y8qISP9F85SsuIKuBjB-FvV4XH7rMGrtHyolvHw');

export { supabase };
