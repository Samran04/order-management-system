import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Order } from '../types';

// Register fonts if needed, otherwise use standard fonts
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        padding: 30, // Default padding
        fontFamily: 'Helvetica',
        fontSize: 9, // Slightly larger base font
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    // Header
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 5,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoBox: {
        backgroundColor: '#EAB308', // Yellow
        padding: 4,
        marginRight: 8,
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#000',
    },
    brandName: {
        flexDirection: 'column',
    },
    brandText: {
        fontSize: 16,
        fontWeight: 'bold', // Helvetica-Bold equivalent
        marginBottom: -2,
    },
    contactInfo: {
        alignItems: 'flex-end',
    },
    contactText: {
        fontSize: 8,
        marginBottom: 2,
        fontWeight: 'bold',
    },
    // Title
    titleBar: {
        backgroundColor: '#E2E8F0', // Light gray
        borderWidth: 1,
        borderColor: '#000',
        padding: 3,
        marginBottom: 5,
        textAlign: 'center',
    },
    titleText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    // Metadata Grid
    metaTable: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginBottom: 5,
    },
    metaRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    metaLabelCell: {
        width: '18%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#FFFFFF',
        padding: 3,
    },
    metaValueCell: {
        width: '32%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontWeight: 'bold',
    },
    labelText: {
        fontSize: 8,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    valueText: {
        fontSize: 9,
        textTransform: 'uppercase',
    },
    // Main Table
    mainTable: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1, // Outer border
        borderRightWidth: 0,
        borderBottomWidth: 1,
        marginBottom: 5,
    },
    tableHeader: {
        backgroundColor: '#E2E8F0',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    // Column Widths
    colSN: { width: '5%', borderRightWidth: 1, borderColor: '#000', height: 60, justifyContent: 'center', alignItems: 'center' },
    colDesc: { width: '40%', borderRightWidth: 1, borderColor: '#000', height: 60, justifyContent: 'center', alignItems: 'center' },
    colSizes: { width: '45%', flexDirection: 'column', height: 60 }, // Contains sub-columns
    colTotal: { width: '10%', borderRightWidth: 1, borderColor: '#000', height: 60, justifyContent: 'center', alignItems: 'center' },

    // Size Header Sub-rows
    sizeHeaderTop: {
        height: 30,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E2E8F0',
        width: '100%',
    },
    sizeHeaderBottom: {
        height: 30,
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        width: '100%',
    },
    sizeCellHeader: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    lastSizeCellHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        borderRightWidth: 1,
        borderColor: '#000',
    },

    // Table Row
    tableRow: {
        flexDirection: 'row',
        height: 90, // Increased row height
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    cellSN: { width: '5%', borderRightWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'center', fontSize: 16, fontWeight: 'bold' },
    cellDesc: { width: '40%', borderRightWidth: 1, borderColor: '#000', padding: 4, justifyContent: 'center' },
    cellSizes: { width: '45%', flexDirection: 'row' },
    cellSizeValue: { flex: 1, borderRightWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'center', fontSize: 14, fontWeight: 'bold' },
    cellTotal: { width: '10%', borderRightWidth: 1, borderColor: '#000', backgroundColor: '#FCE4D6', justifyContent: 'center', alignItems: 'center', fontSize: 18, fontWeight: 'bold' },

    // Images Section
    imagesSection: {
        borderWidth: 1,
        borderColor: '#000',
        height: 120, // Taller image section
        marginBottom: 5,
        padding: 5,
    },
    sectionLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        textDecoration: 'underline',
        marginBottom: 5,
    },
    imageRow: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 5,
    },
    productImage: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#eee',
        objectFit: 'contain',
    },

    // Remarks Section
    remarksSection: {
        borderWidth: 1,
        borderColor: '#000',
        height: 70,
        marginBottom: 5,
        padding: 5,
    },
    remarkLine: {
        fontSize: 9,
        marginBottom: 4,
    },

    // Footer
    footer: {
        marginTop: 'auto', // Push to bottom
        borderTopWidth: 1,
        borderColor: '#000',
        paddingTop: 8,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    }
});

interface OrderPDFProps {
    order: Order;
    items: any[]; // Using list of items for the grid
}

// Helper to format date
const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
};

const OrderSheetPDF = ({ order, items }: OrderPDFProps) => {
    // We need to fill at least 3 rows
    const displayItems = [...items];
    while (displayItems.length < 3) {
        displayItems.push(null); // Placeholder for empty rows
    }

    // Use the first item for common fields if order doesn't have them explicitly
    const commonData = items[0] || {};
    const dateStr = formatDate(new Date().toISOString());

    // Helper to safely get nested array values
    const getCommonValue = (field: string) => {
        const val = commonData[field];
        if (Array.isArray(val)) return val[0] || '';
        return val || '';
    };

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>

                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoBox}>
                            <Text style={[styles.logoText, { color: '#000' }]}>US</Text>
                        </View>
                        <View style={styles.brandName}>
                            <Text style={styles.brandText}>UNIFORM</Text>
                            <Text style={styles.brandText}>STUDIO 81</Text>
                        </View>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactText}>+971 67411456</Text>
                        <Text style={styles.contactText}>www.efzeefashion.com</Text>
                    </View>
                </View>

                {/* Title */}
                <View style={styles.titleBar}>
                    <Text style={styles.titleText}>ORDER SHEET</Text>
                </View>

                {/* Metadata Grid */}
                <View style={styles.metaTable}>
                    {/* Row 1 */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaLabelCell}><Text style={styles.labelText}>ORDER SHEET NO</Text></View>
                        <View style={styles.metaValueCell}><Text style={styles.valueText}>{order.orderNumber}</Text></View>
                        <View style={styles.metaLabelCell}><Text style={styles.labelText}>START DATE</Text></View>
                        <View style={styles.metaValueCell}><Text style={styles.valueText}>{formatDate(order.startDate as any)}</Text></View>
                    </View>
                    {/* Row 2 */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaLabelCell}><Text style={styles.labelText}>ORDER DATE</Text></View>
                        <View style={styles.metaValueCell}><Text style={styles.valueText}>{dateStr}</Text></View>
                        <View style={styles.metaLabelCell}><Text style={styles.labelText}>DELIVERY DATE</Text></View>
                        <View style={[styles.metaValueCell]}><Text style={[styles.valueText, { color: 'red' }]}>{formatDate(order.deliveryDate as any)}</Text></View>
                    </View>
                    {/* Row 3 */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaLabelCell}><Text style={styles.labelText}>BRAND</Text></View>
                        <View style={styles.metaValueCell}><Text style={styles.valueText}>{order.clientName}</Text></View>
                        <View style={styles.metaLabelCell}><Text style={styles.labelText}>FABRIC</Text></View>
                        <View style={styles.metaValueCell}><Text style={styles.valueText}>{getCommonValue('fabric')}</Text></View>
                    </View>
                    {/* Row 4 */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaLabelCell}><Text style={styles.labelText}>CM UNIT</Text></View>
                        <View style={styles.metaValueCell}><Text style={styles.valueText}>{getCommonValue('cmUnit')}</Text></View>
                        <View style={styles.metaLabelCell}><Text style={styles.labelText}>FABRIC SUPPLIER</Text></View>
                        <View style={styles.metaValueCell}><Text style={styles.valueText}>{getCommonValue('fabricSupplier')}</Text></View>
                    </View>
                    {/* Row 5 */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaLabelCell}><Text style={styles.labelText}>CM PRICE</Text></View>
                        <View style={styles.metaValueCell}><Text style={styles.valueText}>{getCommonValue('cmPrice')}</Text></View>
                        <View style={styles.metaLabelCell}><Text style={styles.labelText}>PATTERN FOLLOWED</Text></View>
                        <View style={styles.metaValueCell}><Text style={styles.valueText}>{commonData.patternFollowed || ''}</Text></View>
                    </View>
                </View>

                {/* Main Production Table */}
                <View style={styles.mainTable}>
                    {/* Header */}
                    <View style={styles.tableHeader}>
                        <View style={styles.colSN}><Text style={styles.labelText}>S/N</Text></View>
                        <View style={styles.colDesc}><Text style={styles.labelText}>ITEM DESCRIPTION</Text></View>

                        <View style={styles.colSizes}>
                            <View style={styles.sizeHeaderTop}>
                                <Text style={styles.labelText}>SIZE-WISE QUANTITY</Text>
                            </View>
                            <View style={styles.sizeHeaderBottom}>
                                {['XS/28', 'S', 'M', 'L', 'XL', '2XL', '3XL', '', ''].map((s, i) => (
                                    <View key={i} style={i === 8 ? styles.lastSizeCellHeader : styles.sizeCellHeader}>
                                        <Text style={{ fontSize: 7, fontWeight: 'bold' }}>{s}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.colTotal}><Text style={styles.labelText}>TOTAL</Text></View>
                    </View>

                    {/* Rows */}
                    {displayItems.map((item, index) => {
                        return (
                            <View key={index} style={styles.tableRow}>
                                <View style={styles.cellSN}><Text>{index + 1}</Text></View>
                                <View style={styles.cellDesc}>
                                    {item && (
                                        <View style={{ flexDirection: 'column', padding: 2 }}>
                                            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 2 }}>{item.productName}</Text>
                                            <Text style={{ fontSize: 8, fontStyle: 'italic', color: '#444' }}>{item.itemDescription}</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.cellSizes}>
                                    {['XS/28', 'S', 'M', 'L', 'XL', '2XL', '3XL', '', ''].map((sz, i) => {
                                        let qty = '';
                                        if (item && item.sizes) {
                                            // Find matching size
                                            const size = item.sizes.find((s: any) => {
                                                const sName = s.size.toUpperCase();
                                                if (sz === 'XS/28') return sName === 'XS' || sName === '28' || sName === 'XS/28';
                                                return sName === sz;
                                            });
                                            if (size && size.quantity > 0) qty = size.quantity;
                                        }

                                        return (
                                            <View key={i} style={[styles.cellSizeValue, i === 8 ? { borderRightWidth: 1 } : {}]}>
                                                <Text>{qty}</Text>
                                            </View>
                                        );
                                    })}
                                </View>

                                <View style={styles.cellTotal}>
                                    <Text>{item?.totalQuantity || ''}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Images Section */}
                <View style={styles.imagesSection}>
                    <Text style={styles.sectionLabel}>PRODUCT IMAGES:</Text>
                    <View style={styles.imageRow}>
                        {/* Flatten images from all items and take first 4 */}
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

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>EFZEE FASHION TAILORING LLC, SHOWROOM NO.1, FASHION MART, INDUSTRIAL AREA-1, AJMAN, UAE</Text>
                </View>
            </Page>
        </Document>
    );
};

export default OrderSheetPDF;
