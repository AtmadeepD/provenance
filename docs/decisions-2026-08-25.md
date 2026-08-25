# Decisions 2026-08-25

## 1. Data Model & Definitions

**`kf_from` / `kf_to` bound the Kingfisher OPERATOR ERA — the period the airline
controlled the aircraft.** Not the last day it physically flew. Storage, lessor return,
registration transfer and later service are `events[]`, not era boundaries.

Where the evidence gives a storage date and a transfer date, use the **transfer** for
`kf_to` and note the storage as an event later. One exception recorded below (VT-KFI),
where storage began a full year before transfer and the era date would otherwise lie.
