/** GitHub Pages gibi alt dizinde yayında `basePath` ön eki (ör. "/seravit"). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** public/ klasöründeki bir dosyanın yayın yolu. next/image ve SVG <image> basePath'i otomatik eklemez. */
export const asset = (path: string) => `${BASE_PATH}${path}`;
