import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, Link } from '@react-pdf/renderer';
import { Order } from '../types';

// Register fonts if needed
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Helvetica',
        fontSize: 9,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },

    // Header Section
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 3,
    },
    logoSection: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    logoImage: {
        width: 155,
        height: 55,
        objectFit: 'contain',
    },
    // Line Container
    headerLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 2,
        marginBottom: 6,
    },
    headerLineYellow: {
        height: 2.5,
        backgroundColor: '#EAB308',
        width: 140,
    },
    headerLineGrey: {
        height: 0.5,
        backgroundColor: '#9CA3AF',
        flex: 1,
    },

    // Contact Info (Right side)
    contactContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 8,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    contactText: {
        fontSize: 8,
        fontWeight: 'bold',
        marginRight: 6,
    },
    contactIconCircle: {
        width: 13,
        height: 13,
        borderRadius: 6.5,
        backgroundColor: '#EAB308',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactIconSymbol: {
        color: '#FFFFFF',
        fontSize: 7,
        fontWeight: 'bold',
    },

    // --- MAIN CONTENT ---
    mainBorder: {
        borderWidth: 1,
        borderColor: '#000000',
        flex: 1,
    },

    // Title Bar
    titleBar: {
        backgroundColor: '#D1D5DB',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 11,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    // Metadata Grid — 14% + 22% + flex(spacer) + 14% + 22% = balanced
    metaRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        minHeight: 18,
    },
    metaLabel: {
        width: '14%',
        borderRightWidth: 1,
        borderRightColor: '#000000',
        padding: 3,
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
    },
    metaLabelText: {
        fontSize: 7,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    metaValue: {
        width: '22%',
        borderRightWidth: 1,
        borderRightColor: '#000000',
        padding: 3,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    metaValueText: {
        fontSize: 8,
    },
    metaSpacer: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        backgroundColor: '#FFFFFF',
    },

    // Items Table Header
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        backgroundColor: '#D1D5DB',
        height: 36,
    },
    colSN: { width: '5%', borderRightWidth: 1, borderRightColor: '#000000', justifyContent: 'center', alignItems: 'center' },
    colDesc: { width: '25%', borderRightWidth: 1, borderRightColor: '#000000', justifyContent: 'center', alignItems: 'center' },
    colSizes: { width: '60%', flexDirection: 'column', height: '100%' },
    colTotal: { width: '10%', justifyContent: 'center', alignItems: 'center' },

    headerText: {
        fontSize: 7,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },

    // Size Sub-headers
    sizeHeaderTop: {
        height: '50%',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    sizeHeaderBottom: {
        height: '50%',
        flexDirection: 'row',
        width: '100%',
    },
    sizeCellHeader: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Table Rows — reduced height so 5 rows + sections fit on page
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        minHeight: 50,
    },
    cellText: {
        fontSize: 8,
    },
    cellSN: { width: '5%', borderRightWidth: 1, borderRightColor: '#000000', justifyContent: 'center', alignItems: 'center' },
    cellDesc: { width: '25%', borderRightWidth: 1, borderRightColor: '#000000', padding: 4, justifyContent: 'center' },
    cellSizes: { width: '60%', flexDirection: 'row' },
    cellSizeValue: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cellTotal: {
        width: '10%',
        backgroundColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Image/Remark Sections
    imagesSection: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        padding: 5,
        height: 90,
    },
    remarksSection: {
        padding: 5,
        height: 60,
    },
    sectionLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        textDecoration: 'underline',
        marginBottom: 4,
    },
    imageRow: {
        flexDirection: 'row',
        gap: 8,
    },
    productImage: {
        width: 65,
        height: 65,
        borderWidth: 1,
        borderColor: '#eee',
        objectFit: 'contain',
    },
    remarkLine: {
        fontSize: 7,
        marginBottom: 3,
    },

    // Footer
    footer: {
        marginTop: 4,
        borderTopWidth: 1,
        borderColor: '#000',
        paddingTop: 4,
        alignItems: 'center',
        width: '100%',
    },
    footerText: {
        fontSize: 7,
        color: '#000',
    }
});

interface OrderPDFProps {
    order: Order;
    items: any[];
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    } catch {
        return dateStr;
    }
};

const OrderSheetPDF = ({ order, items }: OrderPDFProps) => {
    // Fill to ensuring visual "page" feel.
    const displayItems = [...items];
    while (displayItems.length < 3) { // Minimum 3 rows
        displayItems.push(null);
    }

    const commonData = items[0] || {};
    const dateStr = formatDate(new Date().toISOString());

    const getCommonValue = (field: string) => {
        const val = commonData[field];
        if (Array.isArray(val)) return val[0] || '';
        return val || '';
    };

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>

                {/* Header Container */}
                <View style={styles.headerContainer}>
                    {/* Left: Logo */}
                    <View style={styles.logoSection}>
                        <Image style={styles.logoImage} src={`${window.location.origin}/us81-logo.png`} />
                    </View>

                    {/* Right: Contact */}
                    <View style={styles.contactContainer}>
                        <View style={styles.contactRow}>
                            <Text style={styles.contactText}>+971 67411456</Text>
                            <View style={styles.contactIconCircle}>
                                <Text style={styles.contactIconSymbol}>P</Text>
                            </View>
                        </View>
                        <View style={styles.contactRow}>
                            <Link src="http://www.efzeefashion.com" style={[styles.contactText, { textDecoration: 'none', color: '#000' }]}>www.efzeefashion.com</Link>
                            <View style={styles.contactIconCircle}>
                                <Text style={styles.contactIconSymbol}>W</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Header Line (Yellow + Grey) */}
                <View style={styles.headerLineContainer}>
                    <View style={styles.headerLineYellow} />
                    <View style={styles.headerLineGrey} />
                </View>

                {/* Main Content Border Wrapper */}
                <View style={styles.mainBorder}>

                    {/* Title */}
                    <View style={styles.titleBar}>
                        <Text style={styles.titleText}>ORDER SHEET</Text>
                    </View>

                    {/* Metadata */}
                    {/* Row 1 */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaLabel}><Text style={styles.metaLabelText}>ORDER SHEET NO</Text></View>
                        <View style={styles.metaValue}><Text style={styles.metaValueText}>{order.orderNumber}</Text></View>
                        <View style={styles.metaSpacer} />
                        <View style={styles.metaLabel}><Text style={styles.metaLabelText}>START DATE</Text></View>
                        <View style={[styles.metaValue, { borderRightWidth: 0 }]}><Text style={styles.metaValueText}>{formatDate(order.startDate!)}</Text></View>
                    </View>
                    {/* Row 2 */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaLabel}><Text style={styles.metaLabelText}>ORDER DATE</Text></View>
                        <View style={styles.metaValue}><Text style={styles.metaValueText}>{dateStr}</Text></View>
                        <View style={styles.metaSpacer} />
                        <View style={styles.metaLabel}><Text style={styles.metaLabelText}>DELIVERY DATE</Text></View>
                        <View style={[styles.metaValue, { borderRightWidth: 0 }]}><Text style={[styles.metaValueText, { color: 'red' }]}>{formatDate(order.deliveryDate!)}</Text></View>
                    </View>
                    {/* Row 3 */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaLabel}><Text style={styles.metaLabelText}>BRAND</Text></View>
                        <View style={styles.metaValue}><Text style={styles.metaValueText}>{order.clientName}</Text></View>
                        <View style={styles.metaSpacer} />
                        <View style={styles.metaLabel}><Text style={styles.metaLabelText}>FABRIC</Text></View>
                        <View style={[styles.metaValue, { borderRightWidth: 0 }]}><Text style={styles.metaValueText}>{getCommonValue('fabric')}</Text></View>
                    </View>
                    {/* Row 4 */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaLabel}><Text style={styles.metaLabelText}>CM UNIT</Text></View>
                        <View style={styles.metaValue}><Text style={styles.metaValueText}>{getCommonValue('cmUnit')}</Text></View>
                        <View style={styles.metaSpacer} />
                        <View style={styles.metaLabel}><Text style={styles.metaLabelText}>FABRIC SUPPLIER</Text></View>
                        <View style={[styles.metaValue, { borderRightWidth: 0 }]}><Text style={styles.metaValueText}>{getCommonValue('fabricSupplier')}</Text></View>
                    </View>
                    {/* Row 5 */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaLabel}><Text style={styles.metaLabelText}>CM PRICE</Text></View>
                        <View style={styles.metaValue}><Text style={styles.metaValueText}>{getCommonValue('cmPrice')}</Text></View>
                        <View style={styles.metaSpacer} />
                        <View style={styles.metaLabel}><Text style={styles.metaLabelText}>PATTERN FOLLOWED</Text></View>
                        <View style={[styles.metaValue, { borderRightWidth: 0 }]}><Text style={styles.metaValueText}>{commonData.patternFollowed || ''}</Text></View>
                    </View>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <View style={styles.colSN}><Text style={styles.headerText}>S/N</Text></View>
                        <View style={styles.colDesc}><Text style={styles.headerText}>ITEM DESCRIPTION</Text></View>
                        <View style={styles.colSizes}>
                            <View style={styles.sizeHeaderTop}><Text style={styles.headerText}>SIZE-WISE QUANTITY</Text></View>
                            <View style={styles.sizeHeaderBottom}>
                                {['XS/28', 'S', 'M', 'L', 'XL', '2XL', '3XL', ''].map((s, i, arr) => (
                                    <View key={i} style={[styles.sizeCellHeader, i === arr.length - 1 ? { borderRightWidth: 0 } : {}]}>
                                        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{s}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={styles.colTotal}><Text style={styles.headerText}>TOTAL</Text></View>
                    </View>

                    {/* Table Rows */}
                    {displayItems.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={styles.cellSN}><Text style={[styles.cellText, { fontWeight: 'bold' }]}>{index + 1}</Text></View>
                            <View style={styles.cellDesc}>
                                {item && (
                                    <>
                                        <Text style={[styles.cellText, { fontWeight: 'bold', fontSize: 10 }]}>{item.productName}</Text>
                                        <Text style={[styles.cellText, { fontSize: 8 }]}>{item.itemDescription}</Text>
                                    </>
                                )}
                            </View>
                            <View style={styles.cellSizes}>
                                <View style={{ flexDirection: 'row', height: '100%' }}>
                                    {['XS/28', 'S', 'M', 'L', 'XL', '2XL', '3XL', ''].map((sz, i, arr) => {
                                        let qty = '';
                                        if (item && item.sizes) {
                                            const size = item.sizes.find((s: any) => {
                                                const sName = s.size.toUpperCase();
                                                if (sz === 'XS/28') return sName === 'XS' || sName === '28' || sName === 'XS/28';
                                                return sName === sz;
                                            });
                                            if (size && size.quantity > 0) qty = size.quantity.toString();
                                        }
                                        return (
                                            <View key={i} style={[styles.cellSizeValue, i === arr.length - 1 ? { borderRightWidth: 0 } : {}]}>
                                                <Text style={styles.cellText}>{qty}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                            <View style={styles.cellTotal}>
                                <Text style={[styles.cellText, { fontWeight: 'bold' }]}>{item?.totalQuantity || ''}</Text>
                            </View>
                        </View>
                    ))}

                    {/* Images Section */}
                    <View style={styles.imagesSection}>
                        <Text style={styles.sectionLabel}>PRODUCT IMAGES:</Text>
                        <View style={styles.imageRow}>
                            {items.flatMap(item => item?.images || []).filter(Boolean).slice(0, 4).map((img, i) => (
                                // eslint-disable-next-line jsx-a11y/alt-text
                                <Image key={i} src={img} style={styles.productImage} />
                            ))}
                        </View>
                    </View>

                    {/* Remarks Section */}
                    <View style={styles.remarksSection}>
                        <Text style={styles.sectionLabel}>REMARKS:</Text>
                        <Text style={styles.remarkLine}>1.</Text>
                        <Text style={styles.remarkLine}>2.</Text>
                        <Text style={styles.remarkLine}>3.</Text>
                        <Text style={styles.remarkLine}>4.</Text>
                    </View>

                </View>

                {/* Footer (Outside Grid) */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>EFZEE FASHION TAILORING LLC, SHOWROOM NO.1, FASHION MART, INDUSTRIAL AREA-1, AJMAN, UAE</Text>
                </View>

            </Page>
        </Document>
    );
};

export default OrderSheetPDF;
